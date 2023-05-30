const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackSchema = require('./track');

const RoomSchema = new Schema(
	{
		room_id: {
			type: String,
			required: true
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
		addedTracks: [trackSchema]
	},
	{
		toJSON: {
			getters: true
		},
		id: false
	}
);

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
