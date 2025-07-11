const express = require('express');
const http = require('http');
const {v4: uuidv4} = require('uuid');
const { Server } = require('socket.io'); 
const ShareDB = require('sharedb');
const json0   = require('ot-json0');
const { Duplex } = require('stream');

const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');




const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
// const io = new Server(server);

ShareDB.types.register(json0.type);
const backend = new ShareDB();


app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/automerge', (req, res) => {
    res.send(Automerge);
});

app.get('/editor', (req, res) => {
    let id = uuidv4();;
    res.redirect(`/editor/${id}`);
}
);

app.get('/editor/:id', (req, res) => {
    res.render('editor')
}
);


// Convert socket.io to ShareDB-compatible stream
function createSocketStream(socket) {
    const stream = new Duplex({ objectMode: true });

    stream._write = (chunk, encoding, callback) => {
        socket.emit('ot-message', chunk);
        callback();
    };

    stream._read = () => {};

    socket.on('ot-message', (msg) => {
        stream.push(msg);
    });

    socket.on('disconnect', () => {
        stream.push(null);
        stream.emit('close');
        console.log(`Socket disconnected: ${socket.id}`);
    });

    return stream;
}

// Socket.io
// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);

//   const stream = new Duplex({ objectMode: true });
//   stream._write = (chunk, _, cb) => {
//     console.log('[Server] Sending chunk to client:', chunk);
//     socket.emit('ot-message', chunk);
//     cb();
//   };

//   stream._read = () => {};

//   socket.on('ot-message', (msg) => {
//     console.log('[Server] Received message from client:', msg);
//     stream.push(msg);
//   });

//   socket.on('disconnect', () => {
//     console.log(`Socket disconnected: ${socket.id}`);
//     stream.push(null);
//     stream.emit('close');
//   });

//   backend.listen(stream);
// });

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  const stream = new WebSocketJSONStream(ws);
  backend.listen(stream);
});



// Server
server.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});