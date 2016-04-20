var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){   
   res.sendFile(__dirname + '/public/index.html');
});

app.get('/:sessionId', function(req, res){   
   console.log("sessionId requested: " + req.params.sessionId);
   res.sendFile(__dirname + '/public/session.html');
});

io.on('connection', function(socket){
   
   socket.on('login', function(sessionId){ // emitted by session.html 
      socket.emit('directmessage', 'welcome to session ' + sessionId + ', your id is ' + socket.id);
   });
   
   console.log('user connected: ' + socket.id);
   socket.on('disconnect', function(){
      console.log('user disconnected: ' + socket.id);
   });
});

http.listen(3000, function(){
   console.log('listening on *:3000');
});
