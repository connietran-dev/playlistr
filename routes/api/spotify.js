const router = require('express').Router(),
	querystring = require('querystring'),
	request = require('request');

require('dotenv').config();

let redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/api/spotify/callback';

// ROUTE: /api/spotify/login
router.get('/login', function (req, res) {
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

// ROUTE: /api/spotify/callback
router.get('/callback', function (req, res) {
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

module.exports = router;
