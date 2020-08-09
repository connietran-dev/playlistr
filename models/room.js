const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
	room_id: {
		type: String,
		required: true
	},
	addedTracks: [
		{
			info: {
				type: String,
				required: true
			},
			spotifyId: {
				type: String,
				required: true
			},
			played: {
				type: Boolean,
				default: false
			},
			progress: {
				type: Number,
				default: 0,
				required: false
			},
			nowPlaying: {
				type: Boolean,
				default: false
			}
		}
	]
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;
