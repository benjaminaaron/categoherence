var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var utils = require('./modules/utils.js');
var Session = require('./modules/Session.js');
var activeSessions = {};

var libs = {
    'jquery.js': '/node_modules/jquery/dist/jquery.min.js',
    'notie.js': '/node_modules/notie/dist/notie.min.js',
    'notie.css': '/node_modules/notie/dist/notie.css',
    'sortable.js': '/node_modules/sortablejs/Sortable.min.js',
    'main.css': '/public/css/main.css',
    'main.js': '/public/js/main.js',
    'Entity.js': '/public/js/Entity.js',
    'Grouping.js': '/public/js/Grouping.js'
};

app.get('/', function(req, res) {   
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/:var', function(req, res) {
    switch(req.params.var) {
        case 'create':
            res.sendFile(__dirname + '/public/create.html');
            break;
        case 'dashboard':
            res.sendFile(__dirname + '/public/dashboard.html');
            break;
        case 'favicon.ico':
            //TODO
            break;
        default:
            if(activeSessions[utils.formatNameAsId(req.params.var)])
                res.sendFile(__dirname + '/public/session.html');
            else
                res.sendFile(__dirname + '/public/no-session.html');
    }
});

app.get('/:var/results', function(req, res) {
    if(activeSessions[utils.formatNameAsId(req.params.var)])
        res.sendFile(__dirname + '/public/results.html');
    else
        res.sendFile(__dirname + '/public/no-session.html');
});

app.get('*/lib/:lib', function(req, res) {
    res.sendFile(__dirname + libs[req.params.lib]);
});

io.on('connection', function(socket) {
    //console.log('user connected: ' + socket.id);

    socket.on('create-session', function(sessionData) {
        var sessionId = utils.formatNameAsId(sessionData.name);
        if(activeSessions[sessionId])
            socket.emit('err', 'a session with the id ' + sessionId + ' already exists');    
        else {
            sessionData.id = sessionId;
            activeSessions[sessionId] = new Session(sessionData);
            socket.emit('success', 'new session has been created: <b><a href="/' + sessionId + '">' + sessionId + '</a></b>');  
        }
    });
   
    socket.on('login-session', function(sessionId) {
        sessionId = utils.formatNameAsId(sessionId);
        if(activeSessions[sessionId]) {
            socket.emit('info', 'welcome to session <b>' + sessionId + '</b>, your id is ' + socket.id);
            socket.emit('session-data', activeSessions[sessionId].data);
        }
        else
            socket.emit('err', 'no session exists with the id <b>' + sessionId + '</b>');
    });
    
    socket.on('submit', function(groupings) {
        console.log(groupings);
    });
    
    socket.on('login-results', function(sessionId) {
        sessionId = utils.formatNameAsId(sessionId);
        if(activeSessions[sessionId])
            socket.emit('info', 'this is the results page of session <b>' + sessionId + '</b>, your id is ' + socket.id);
        else
            socket.emit('err', 'no session exists with the id <b>' + sessionId + '</b>');
    });
    
    socket.on('get-dashboard', function() {
        if(Object.keys(activeSessions).length > 0)
            socket.emit('dashboard', activeSessions);
    });
   
    socket.on('disconnect', function() {
        //console.log('user disconnected: ' + socket.id);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
