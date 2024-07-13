import http from 'http';
import { Server } from 'socket.io';

const whitelist = ['http://localhost:5173', 'http://localhost:3000'];

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: whitelist,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

let currentUser = 'user 1';
let messages = [];

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });

  socket.on('send message', (msg) => {
    console.log('message: ' + msg);
    let _msg = JSON.parse(msg);
    messages.push(_msg);
    currentUser = _msg.user;
    socket.emit('recieve message', msg);
  });
});

server.listen(8000, () => {
  console.log('Server running on port 8000...');
});
