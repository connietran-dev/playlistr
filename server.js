const express = require('express'),
	request = require('request'),
	querystring = require('querystring'),
	morgan = require('morgan'),
	path = require('path'),
	http = require('http'),
	socketio = require('socket.io'),
	handlers = require('./handlers');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8888;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));

let redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/api/spotify/callback';

app.get('/api/spotify/login', function (req, res) {
	res.redirect(
		'https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: process.env.client_id,
			scope:
				'user-read-private user-read-email playlist-modify-private playlist-modify-public user-read-currently-playing user-read-playback-state user-modify-playback-state',
			redirect_uri
		})
	);
});

app.get('/api/spotify/callback', function (req, res) {
	let code = req.query.code || null;
	let authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri,
			grant_type: 'authorization_code'
		},
		headers: {
			Authorization:
				'Basic ' +
				Buffer.from(process.env.client_id + ':' + process.env.client_secret).toString('base64')
		},
		json: true
	};
	request.post(authOptions, (error, response, body) => {
		var access_token = body.access_token;
		let uri = process.env.FRONTEND_URI || 'http://localhost:3000/home';
		res.redirect(uri + '?access_token=' + access_token);
	});
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
	});
}

const server = http.createServer(app);
const io = socketio(server);

io.on('connect', (socket) => {
	console.log('Client connected to server: ', socket.id);

	// After user is connected, then joins room
	socket.on('join room', (roomId, user) => {

		// Utilize handler to add user
		handlers.addUser(roomId, user, socket);

		// Then subscribe (join) the user's socket to a channel for the room
		socket.join(roomId);

		// And emit the user just joined to all users in the room 
		io.in(roomId).emit('user status', { text: `${user.display_name} has joined room ${roomId}`, roomId, user });

		// Get current users in room and emit to room, including sender
		let currentUsers = handlers.getUsersInRoom(roomId);
		io.in(roomId).emit('current users', currentUsers);
	});

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