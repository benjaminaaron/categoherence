var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Session = require('./js/Session.js');
var activeSessions = {};

var libs = {
    'jquery.js': '/node_modules/jquery/dist/jquery.min.js',
    'notie.js': '/node_modules/notie/dist/notie.min.js',
    'notie.css': '/node_modules/notie/dist/notie.css',
    'main.css': '/css/main.css'
};

app.get('/', function(req, res){   
   res.sendFile(__dirname + '/public/index.html');
});

app.get('/:var', function(req, res){
   switch(req.params.var){
      case 'create':
         res.sendFile(__dirname + '/public/create.html');
         break;
      default:
         if(activeSessions[req.params.var])
            res.sendFile(__dirname + '/public/session.html');
         else
            res.sendFile(__dirname + '/public/no-session.html');
   }
});

app.get('*/lib/:lib', function(req, res) {
    res.sendFile(__dirname + libs[req.params.lib]);
});

io.on('connection', function(socket){
    console.log('user connected: ' + socket.id);

    socket.on('create-session', function(sessionData) {
        if(activeSessions[sessionData.id])
            socket.emit('err', 'a session with that name already exists');    
        else {
            activeSessions[sessionData.id] = new Session(sessionData);
            socket.emit('info', 'the session ' + '"' + sessionData.id + '" has been created');  
        }
    });
   
    socket.on('login', function(sessionId){
        if(activeSessions[sessionId])
            socket.emit('info', 'welcome to session ' + sessionId + ', your id is ' + socket.id);
        else
            socket.emit('err', 'no session exists with the name ' + sessionId);
    });
   
    socket.on('disconnect', function(){
        console.log('user disconnected: ' + socket.id);
    });
});

http.listen(3000, function(){
   console.log('listening on *:3000');
});
