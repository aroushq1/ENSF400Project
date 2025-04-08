/**
 * @file server.js
 * @description Express server setup for serving the Pong game with AI.
 */

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the public directory
app.use(express.static("public"));

// Start the server
server.listen(3000, () => {
    console.log("Server started on port 3000");
});
