const router = require('express').Router();
const roomsController = require('../../controllers/roomsController');

// ROUTE: /api/rooms
router.route('/').get(roomsController.findAll).post(roomsController.create);

// ROUTE: /api/rooms/:id
router.route('/:id').get(roomsController.findByName).put(roomsController.update).delete(roomsController.remove);

// ROUTE: /api/rooms/:roomId/:trackId
router.route('/:roomId/:trackId').put(roomsController.updatePlayedStatus);

module.exports = router;
