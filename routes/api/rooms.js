const router = require('express').Router();
const roomsController = require('../../controllers/roomsController');

// ROUTE: /api/rooms
router.route('/').get(roomsController.findAll).post(roomsController.create);

// ROUTE: /api/rooms/:id
router
	.route('/:id')
	.get(roomsController.findByName)
	.put(roomsController.addTrack)
	.delete(roomsController.remove);

// ROUTE: /api/rooms/:roomId/:trackId/:updateType
router
	.route('/:roomId/track/:trackId/:updateType')
	.put(roomsController.updateTrack);

// ROUTE: /api/rooms/playing/:trackId
router.route('/:roomId/playing/:trackId').put(roomsController.updateNowPlaying);

// ROUTE: /api/rooms/progress/:trackId/:progress
router
	.route('/:roomId/progress/:trackId/:progress')
	.put(roomsController.updateSongProgress);

module.exports = router;
