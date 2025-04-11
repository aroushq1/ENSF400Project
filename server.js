/**
 * @file server.js
 * @description Express server setup for serving the Pong game with AI.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');  // Use destructuring to import Server

const app = express();
const server = http.createServer(app);

// Use the updated initialization for socket.io
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A user connected");

    // You can handle socket events here
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server started on port 3000");
});
