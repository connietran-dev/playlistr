const express = require('express'),
	request = require('request'),
	querystring = require('querystring'),
	morgan = require('morgan'),
	path = require('path'),
	http = require('http'),
	socketio = require('socket.io');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8888;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));

let redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/api/spotify/callback';
console.log('redirect_uri: ', redirect_uri);

app.get('/api/spotify/login', function (req, res) {
	console.log('/login redirect_uri: ', redirect_uri);

	let query = querystring.stringify({
		response_type: 'code',
		client_id: process.env.client_id,
		scope:
			'user-read-private user-read-email playlist-modify-private playlist-modify-public user-read-currently-playing user-read-playback-state user-modify-playback-state',
		redirect_uri
	});
	console.log(query);

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
	console.log('/callback redirect_uri: ', redirect_uri);
	request.post(authOptions, (error, response, body) => {
		var access_token = body.access_token;
		let uri = process.env.FRONTEND_URI || 'http://localhost:3000/home';
		console.log('/callback FRONTEND_URI: ', uri);
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

let interval;

io.on('connection', (socket) => {
	console.log('New user client connected');

	// Test function - TODO - to be removed
	if (interval) {
		clearInterval(interval);
	}
	interval = setInterval(() => { getApiAndEmit(socket) }, 1000);

	socket.on('disconnect', () => {
		console.log('User client disconnected');
		clearInterval(interval);
	});
});

const getApiAndEmit = socket => {
	const response = new Date();
	// Emitting a new message. Will be consumed by the client
	socket.emit('FromAPI', response);
};

console.log(`Listening on port ${port}.`);
server.listen(port);