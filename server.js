const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

server.listen(3000, () => {
    console.log("Server started on port 3000")
});