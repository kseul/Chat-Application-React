const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: '*', credentials: true },
});

io.on('connection', (socket) => {
  console.log('연결!!!');

  socket.on('입장', ({ name, room }) => {
    const { user } = addUser({ id: socket.id, name, room });

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, 어서오시개! ${user.room}`,
    });
    // 해당 사용자 외 다른 모든 사람들에게 알리는 메세지
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} 님이 들어오셨습니다!`,
    });

    socket.join(user.room);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on('메세지전송', (message, callback) => {
    const user = getUser(socket.id);
    console.log('socket.id: ', socket.id);
    console.log('user: ', user);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} 님이 떠나셨습니다.`,
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
    console.log('유저가 떠났습니다.');
  });
});

app.use(router);

server.listen(3000, () => console.log('hi'));
