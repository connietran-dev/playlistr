const path = require('path');
const router = require('express').Router();
const spotifyRoutes = require('./spotify');

router.use('/api/spotify', spotifyRoutes);

router.use((req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router;
