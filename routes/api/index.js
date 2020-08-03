const router = require('express').Router();
const spotifyRoutes = require('./spotify');
const roomRoutes = require('./rooms');

router.use('/spotify', spotifyRoutes);
router.use('/rooms', roomRoutes);

module.exports = router;
