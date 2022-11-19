const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const MongoClient = require('mongodb').MongoClient;
const dbClient = new MongoClient('mongodb://localhost:27017');

const utils = require('./modules/utils.js');
const Session = require('./modules/Session.js');
const dev = require('./modules/dev.js');
let activeSessions = {};

let sessionsDb;
let submissionsDb;
let guestsDb;
let reactionsDb;

dbClient.connect().then(() => {
    const db = dbClient.db('db');
    sessionsDb = db.collection('sessions');
    submissionsDb = db.collection('submissions');
    guestsDb = db.collection('guests');
    reactionsDb = db.collection('reactions');
    sessionsDb.find().toArray().then(sessions => {
        for (let sessionData of sessions) {
            activeSessions[sessionData.id] = new Session(sessionData, submissionsDb);
            console.log("imported session " + sessionData.id + " from db");
        }
        submissionsDb.find().toArray().then(submissions => {
            for (let submission of submissions) {
                activeSessions[submission.sessionId].retroSubmissions.push(submission);
            }
            reactionsDb.find().toArray().then(reactions => {
                for (let reaction of reactions) {
                    activeSessions[reaction.sessionId].addReactionToSubmission(reaction.submissionId);
                }
            });
        });
        guestsDb.find().toArray().then(guests => {
            for (let guest of guests) {
                activeSessions[guest.sessionId].addGuest(guest);
            }
        });
    });
});

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
        case 'dev':
            res.sendFile(__dirname + '/public/dev.html');
            break;
        default:
            if (activeSessions[utils.formatNameAsId(req.params.var)])
                res.sendFile(__dirname + '/public/session-retro.html');
            else
                res.sendFile(__dirname + '/public/no-session.html');
    }
});

app.get('/:var/results-retro', function(req, res) {
    if (activeSessions[utils.formatNameAsId(req.params.var)])
        res.sendFile(__dirname + '/public/results-retro.html');
    else
        res.sendFile(__dirname + '/public/no-session.html');
});

app.get('/:var/results', function(req, res) {
    if (activeSessions[utils.formatNameAsId(req.params.var)])
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
    
    socket.on('create-session', function(sessionData) {
        sessionData.id = utils.formatNameAsId(sessionData.name);
        if (activeSessions[sessionData.id])
            socket.emit('err', 'a session with the id ' + sessionData.id + ' already exists');
        else {
            activeSessions[sessionData.id] = new Session(sessionData);
            sessionsDb.insertOne(sessionData);
            console.log("created session and stored in db: " + sessionData.id);
            socket.emit('success', 'new session has been created: <b><a href="/' + sessionData.id + '">' + sessionData.id + '</a></b>');
        }
    });
   
    socket.on('session-login', function(sessionId) {
        if (activeSessions[sessionId]) {
            socket.emit('info', 'welcome to session <b>' + sessionId + '</b>'); //, your id is ' + socket.id);
            socket.emit('session-login-response', {
                data: activeSessions[sessionId].data,
                submissions: activeSessions[sessionId].retroSubmissions,
                guests: activeSessions[sessionId].guests
            });
        }
        else
            socket.emit('err', 'no session exists with the id <b>' + sessionId + '</b>');
    });

    socket.on('retro-submission', function(submissionData) {
        let session = activeSessions[submissionData.sessionId];
        submissionData.id = session.retroSubmissions.length;
        session.handleRetroSubmission(submissionData);
        submissionsDb.insertOne(submissionData).then(() => console.log('submission stored in db'));
        io.emit('broadcast-retro-submission', submissionData);
    });

    socket.on('add-guest', function(guest) {
        let session = activeSessions[guest.sessionId];
        guest.id = Object.keys(session.data.entities).length + session.guests.length;
        session.addGuest(guest);
        guestsDb.insertOne(guest).then(() => console.log('guest stored in db'));
        io.emit('broadcast-new-guest', guest);
    });
    
    socket.on('submission', function(submission) {
        activeSessions[submission.sessionId].handleSubmission(submission.data);
        socket.emit('success', 'your submission was received, see the <a href="' + submission.sessionId + '/results">results</a>');
    });

    socket.on('reaction-added', function(reactionData) {
        activeSessions[reactionData.sessionId].addReactionToSubmission(reactionData.submissionId);
        reactionsDb.insertOne(reactionData).then(() => console.log('reaction stored in db'));
        io.emit('broadcast-reaction-added', reactionData);
    });
    
    socket.on('login-results', function(sessionId) {
        let session = activeSessions[utils.formatNameAsId(sessionId)]
        if (session) {
            socket.emit('info', 'this is the results page of session <b>' + sessionId + '</b>, your id is ' + socket.id);
            socket.emit('session-info', session.getInfo());
            socket.emit('session-leaderboard', session.getLeaderboard());
            socket.emit('session-grouping-suggestions', session.getGroupingSuggestions());
        }
        else
            socket.emit('err', 'no session exists with the id <b>' + sessionId + '</b>');
    });

    socket.on('login-retro-results', function(sessionId) {
        let session = activeSessions[utils.formatNameAsId(sessionId)]
        if (session) {
            // TODO
        }
        else
            console.log("no session exists with the id " + sessionId);
    })
    
    socket.on('get-dashboard', function() {
        let keys = Object.keys(activeSessions);
        if (keys.length > 0) {
            let list = [];
            for (let i = 0; i < keys.length; i ++)
                list.push(activeSessions[keys[i]].getDashboardEntry());
            socket.emit('dashboard', list);
        }
    });
    
    socket.on('end-session', function(id) {
        if (id === 'all')
            activeSessions = {};
        else 
            delete activeSessions[id];
    });
   
    socket.on('disconnect', function() {
        //console.log('user disconnected: ' + socket.id);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
