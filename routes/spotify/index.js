const router = require('express').Router();
const spotifyController = require('../../controllers/spotifyController');

// router.route('/spotify/login').get(spotifyController.login);
// router.route('/callback').get(spotifyController.callback);

router.get('/spotify/login', spotifyController.login);
router.get('/callback', spotifyController.callback);

module.exports = router;
