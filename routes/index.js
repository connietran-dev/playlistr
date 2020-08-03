// const path = require('express').Router();
const apiRoutes = require('./api');
const router = require('./api/spotify');

router.use('/api', apiRoutes);

module.exports = router;
