const request = require('supertest');
const { Server } = require('socket.io');
const http = require('http');
const express = require('express');

// Create a new Express app and socket server for testing
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

describe('GET /', () => {
    it('should return Hello World', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('Hello World');
    });
});

// Socket.io connection test
describe('Socket.io', () => {
    it('should handle socket connections', (done) => {
        const socket = require('socket.io-client')('http://localhost:3000');
        
        socket.on('connect', () => {
            expect(socket.connected).toBe(true);
            socket.disconnect();
            done();
        });
    });
});
