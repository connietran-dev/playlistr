const express = require('express'),
  morgan = require('morgan'),
  path = require('path'),
  http = require('http'),
  { Server } = require('socket.io'),
  mongoose = require('mongoose'),
  routes = require('./routes'),
  handlers = require('./handlers');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8888;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));

app.use(routes);

mongoose
  .connect(process.env.MONGODB_ATLAS_URI || 'mongodb://localhost/playlistr', {
    useNewUrlParser: true, // Removes deprecation warning
    useUnifiedTopology: true
  })
  .catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
  });
}

io.on('connection', socket => {
  console.log('Client connected to server:', socket.id);

  socket.on('join room', (roomId, user) => {
    handlers.addUser(roomId, user, socket);
    socket.join(roomId);

    socket.to(roomId).emit('user status', {
      text: `${user.name} joined...`,
      roomId,
      user
    });

    const currentUsers = handlers.getUsersInRoom(roomId);
    io.in(roomId).emit('current users', currentUsers);
  });

  socket.on('host song', ({ song, roomId }) => {
    socket.emit('room song', song);
  });

  socket.on('disconnect', () => {
    const user = handlers.removeUser(socket);

    if (user) {
      io.to(user.room).emit('user status', { text: `${user.name} left...` });
      io.to(user.room).emit('current users', handlers.getUsersInRoom(user.room));

      console.log('Client disconnected from server: ', user.socketId);
    }
  });
});

console.log(`Listening on port ${port}.`);

server.listen(port);
