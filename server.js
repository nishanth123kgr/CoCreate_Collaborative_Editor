const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const { log } = require('console');


app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/editor', (req, res) => {  
    res.render('editor');
});

app.get('/automerge', (req, res) => {
    res.send(Automerge);
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});