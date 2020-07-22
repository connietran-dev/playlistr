const request = require('request');
const querystring = require('querystring');

require('dotenv').config();

let redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/callback';

module.exports = {
	login: (req, res) => {
		res.redirect(
			'https://accounts.spotify.com/authorize?' +
				querystring.stringify({
					response_type: 'code',
					client_id: process.env.client_id,
					scope:
						'user-read-private user-read-email playlist-modify-private playlist-modify-public',
					redirect_uri
				})
		);
	},
	callback: (req, res) => {
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
					Buffer.from(process.env.client_id + ':' + process.env.client_secret).toString(
						'base64'
					)
			},
			json: true
		};
		request.post(authOptions, (error, response, body) => {
			var access_token = body.access_token;
			let uri = process.env.FRONTEND_URI || 'http://localhost:3000/home';
			res.redirect(uri + '?access_token=' + access_token);
		});
	}
};
