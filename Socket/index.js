const io = require('socket.io')(5555, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

let users = [];

const getUserById = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  socket.on('addUser', (userId) => {
    if (!users.some((user) => user.userId === userId)) {
      users.push({
        userId: userId,
        socketId: socket.id,
      });
    }
    console.log('Connect | ', users);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', (data) => {
    const user = getUserById(data.receiverId);
    if (!user) return;
    io.to(user.socketId).emit('getMessage', data);
  });

  socket.on('disconnect', () => {
    users = users.filter((user) => user.socketId !== socket.id);
    console.log('Disconnect | ', users);
    io.emit('users-get', users);
  });
});
