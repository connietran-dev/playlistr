const router = require('express').Router(),
  querystring = require('querystring'),
  request = require('request');

require('dotenv').config();

const redirectURI = process.env.NODE_ENV
  ? process.env.REDIRECT_URL
  : 'http://localhost:8888/api/spotify/callback';

// ROUTE: /api/spotify/login
router.get('/login', function (req, res) {
  const url =
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.client_id,
      scope:
        'user-read-private user-read-email playlist-modify-private playlist-modify-public user-read-currently-playing user-read-playback-state user-modify-playback-state',
      redirect_uri: redirectURI,
    });

  res.redirect(url);
});

// ROUTE: /api/spotify/callback
router.get('/callback', function (req, res) {
  let code = req.query.code || null;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirectURI,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(process.env.client_id + ':' + process.env.client_secret).toString('base64'),
    },
    json: true,
  };
  request.post(authOptions, (error, response, body) => {
    const access_token = body.access_token;
    const url = process.env.NODE_ENV ? process.env.FRONTEND_URL : 'http://localhost:3000/home';

    res.redirect(url + '?access_token=' + access_token);
  });
});

module.exports = router;
