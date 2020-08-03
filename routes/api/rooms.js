const router = require('express').Router();
const roomsController = require('../../controllers/roomsController');

// ROUTE: /api/rooms
router.route('/').get(roomsController.findAll).post(roomsController.create);

// ROUTE: /api/rooms/:name
router.route('/:id').get(roomsController.findByName).put(roomsController.update).delete(roomsController.remove);

module.exports = router;
