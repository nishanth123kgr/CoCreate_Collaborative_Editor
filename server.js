const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
var admin = require("firebase-admin");
const Y = require('yjs');
let ydoc = new Y.Doc();

var serviceAccount = require("./cocreate-e498b-firebase-adminsdk-q96du-d87265ed48.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cocreate-e498b-default-rtdb.firebaseio.com"
});

var db = admin.database();

// Middleware
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/editor', (req, res) => {
    let uid = uuidv4();
    const yjsSnapshot = Y.encodeStateAsUpdate(ydoc);
    const serializedSnapshot = JSON.stringify(yjsSnapshot);
    db.ref('documents/' + uid).set(serializedSnapshot).then(() => {
        console.log('Document saved!');
    }).catch((error) => {
        console.log('Document failed to save: ', error);
    });
    res.redirect(`/editor/${uid}`);
});

app.get('/editor/:id', (req, res) => {
    let id = req.params.id;
    db.ref('documents/' + id).once('value').then((snapshot) => {
        const serializedSnapshot = snapshot.val();
        if (serializedSnapshot) {
          const yjsSnapshot = JSON.parse(serializedSnapshot);
          Y.applyUpdate(ydoc, yjsSnapshot);
          console.log('Yjs document loaded from Firebase');
          console.log(ydoc.toJSON());
        }
      })
      .catch((error) => {
        console.error('Error loading Yjs document:', error);
      });
    

    res.render('editor');
});

app.get('/automerge', (req, res) => {
    res.send(Automerge);
});

// Socket.io
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    io.on('disconnect', () => {
        console.log('user disconnected');
    }
    );
    socket.on('doc-updated', (msg) => {
        console.log(msg);
        socket.broadcast.emit('update-doc', msg);
    });
});


// Server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});