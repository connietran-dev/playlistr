const express = require('express'),
	morgan = require('morgan'),
	path = require('path'),
	http = require('http'),
	socketio = require('socket.io'),
	mongoose = require('mongoose'),
	routes = require('./routes'),
	handlers = require('./handlers');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8888;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));

app.use(routes);

mongoose.connect(process.env.MONGODB_ATLAS_URI || 'mongodb://localhost/playlistr', {
	useNewUrlParser: true, // Removes deprecation warning
	useUnifiedTopology: true
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
	});
}

const server = http.createServer(app);
const io = socketio(server);

io.on('connect', socket => {
	console.log('Client connected to server: ', socket.id);

	// After user is connected, then joins room
	socket.on('join room', (roomId, user) => {

		// Utilize handler to add user
		handlers.addUser(roomId, user, socket);

		// Then subscribe (join) the user's socket to a channel for the room
		socket.join(roomId);

		// And emit the user just joined to all users in the room
		io.in(roomId).emit('user status', {
			text: `${user.display_name} has joined room ${roomId}`,
			roomId,
			user
		});

		// Get current users in room and emit to room, including sender
		let currentUsers = handlers.getUsersInRoom(roomId);
		io.in(roomId).emit('current users', currentUsers);
	});

	// Listen for the host's current song, then emit that to the room for new users who join
	socket.on('host song', ({ song, room }) => {
		io.in(room).emit('current song', song);
	});

	// When a socket disconnects, remove user from usersArray
	socket.on('disconnect', () => {
		let user = handlers.removeUser(socket);

		// If user existed and was removed, emit message that user left to clients in user's room, excluding sender
		// Also emit current users in room
		if (user) {

			io.to(user.room).emit('user status', { text: `${user.display_name} has left the room ${user.room}` });
			io.to(user.room).emit('current users', handlers.getUsersInRoom(user.room));

		}

		console.log('Client disconnected from server: ', socket.id);
	});
});

console.log(`Listening on port ${port}.`);
server.listen(port);
