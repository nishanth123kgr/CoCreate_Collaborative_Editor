const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');


app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/editor', (req, res) => {  
    let uid = uuidv4();
    res.redirect(`/editor/${uid}`);
});

app.get('/editor/:id', (req, res) => {
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