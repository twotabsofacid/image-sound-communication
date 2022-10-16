require('dotenv').config();
const path = require('path');
const express = require('express');
const http = require('http');
const socket = require('socket.io');

// Constants
const port = process.env.PORT || 6969;

class Server {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socket();
    this.setup();
    this.start();
  }
  setup() {
    this.app.use((_, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    });
    this.app.use('/', express.static(path.join(__dirname, '..', 'web')));
    this.app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname, '..', 'web', 'index.html'));
    });
    this.io.on('connection', (socket) => {
      console.log('=========== Socket Connected! ===========');
      // Socket listeners...
      socket.on('disconnect', function () {
        console.log('=========== Socket Disconnected! ===========');
      });
    });
    this.io.attach(this.server, {
      cors: {
        origin: '*'
      }
    });
  }
  start() {
    this.server.listen(port, '0.0.0.0', () => {
      console.log(`Start Backend at Port ${port}`);
    });
  }
}

new Server();
