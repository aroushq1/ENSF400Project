
const request = require('supertest');
const http = require('http');
const express = require('express');

// Setup app and route
const app = express();
app.get('/', (req, res) => {
  res.send("Hello World");
});
app.use(express.static("public"));

describe('GET /', () => {
  it('should return Hello World', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello World");
  });
});


describe.skip('Socket.io', () => {
  let io, server;

  beforeAll((done) => {
    const { Server } = require('socket.io');
    const httpServer = http.createServer(app);
    io = new Server(httpServer); // This line is now safe
    httpServer.listen(3000, done);
    server = httpServer;
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should handle socket connections', (done) => {
    const socket = require('socket.io-client')('http://localhost:3000');
    socket.on('connect', () => {
      expect(socket.connected).toBe(true);
      socket.disconnect();
      done();
    });
  });
});
