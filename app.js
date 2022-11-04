const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const utils = require('./modules/utils.js');
const Session = require('./modules/Session.js');
const dev = require('./modules/dev.js');
const activeSessions = {};

const libs = {
    //JS
    'jquery.js': '/node_modules/jquery/dist/jquery.min.js',
    'notie.js': '/node_modules/notie/dist/notie.min.js',
    'jquery-ui_sortable.min.js': '/public/js/jquery-ui_sortable.min.js',
    'main.js': '/public/js/main.js',
    //CSS
    'notie.css': '/node_modules/notie/dist/notie.css',
    'jquery-ui_sortable.min.css': '/public/css/jquery-ui_sortable.min.css',
    'main.css': '/public/css/main.css'
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
        case 'dev':
            res.sendFile(__dirname + '/public/dev.html');
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
    
    socket.on('dev', function() {
        let devSession = activeSessions['dev_session'] = new Session(dev.getSessionData());
        dev.makeSubmissions(devSession);
    });
    
    socket.on('create-session', function(data) {
        let sessionId = utils.formatNameAsId(data.info.name);
        if(activeSessions[sessionId])
            socket.emit('err', 'a session with the id ' + sessionId + ' already exists');    
        else {
            data.info.id = sessionId;
            activeSessions[sessionId] = new Session(data);
            socket.emit('success', 'new session has been created: <b><a href="/' + sessionId + '">' + sessionId + '</a></b>');  
        }
    });
   
    socket.on('login-session', function(sessionId) {
        sessionId = utils.formatNameAsId(sessionId);
        if(activeSessions[sessionId]) {
            socket.emit('info', 'welcome to session <b>' + sessionId + '</b>, your id is ' + socket.id);
            socket.emit('session-info', activeSessions[sessionId].info);
        }
        else
            socket.emit('err', 'no session exists with the id <b>' + sessionId + '</b>');
    });
    
    socket.on('submission', function(submission) {
        activeSessions[submission.sessionId].handleSubmission(submission.data);
        socket.emit('success', 'your submission was received, see the <a href="' + submission.sessionId + '/results">results</a>');
    });
    
    socket.on('login-results', function(sessionId) {
        let session = activeSessions[utils.formatNameAsId(sessionId)]
        if(session) {
            socket.emit('info', 'this is the results page of session <b>' + sessionId + '</b>, your id is ' + socket.id);
            socket.emit('session-info', session.getInfo());
            socket.emit('session-leaderboard', session.getLeaderboard());
            socket.emit('session-grouping-suggestions', session.getGroupingSuggestions());
        }
        else
            socket.emit('err', 'no session exists with the id <b>' + sessionId + '</b>');
    });
    
    socket.on('get-dashboard', function() {
        let keys = Object.keys(activeSessions);
        if(keys.length > 0) {
            let list = [];
            for(let i = 0; i < keys.length; i ++)
                list.push(activeSessions[keys[i]].getDashboardEntry());
            socket.emit('dashboard', list);
        }
    });
    
    socket.on('end-session', function(id) {
        if(id == 'all')
            activeSessions = {};
        else 
            delete activeSessions[id];
    });
   
    socket.on('disconnect', function() {
        //console.log('user disconnected: ' + socket.id);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
