const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackSchema = new Schema(
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
		},
		likes: []
	},
	{
		toJSON: {
			getters: true
		},
		id: false
	}
);

module.exports = trackSchema;
