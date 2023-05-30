const db = require('../models');

module.exports = {
	findAll: (req, res) => {
		db.Room.find(req.query)
			.then(data => res.json(data))
			.catch(err => res.status(422).json(err));
	},
	findByName: (req, res) => {
		db.Room.findOne({ room_id: req.params.id })
			.then(data => res.json(data))
			.catch(err => res.status(422).json(err));
	},
	create: (req, res) => {
		db.Room.create(req.body)
			.then(data => res.json(data))
			.catch(err => res.status(422).json(err));
	},
	addTrack: (req, res) =>
		db.Room.findOneAndUpdate(
			{ room_id: req.params.id },
			{
				$push: { addedTracks: req.body }
			}
		)
			.then(data => res.json(data))
			.catch(err => res.status(422).json(err)),

	// Using Spotify track id as trackId
	updateTrack: ({ params, query }, res) => {
		db.Room.findOne({ room_id: params.roomId })
			.then(data => {
				if (data && data.addedTracks[0]) {
					data.addedTracks = data.addedTracks.map(track => {
						switch (params.updateType) {
							case 'played':
								if (track.spotifyId == params.trackId) track.played = true;
								break;
							case 'now_playing':
								track.nowPlaying =
									track.spotifyId == params.trackId ? true : false;
								break;
							case 'like':
								if (track.spotifyId == params.trackId)
									track.likes.push(query.user);

								break;

							case 'unlike':
								if (track.spotifyId == params.trackId)
									track.likes = track.likes.filter(user => user !== query.user);
								break;
							default:
								break;
						}
						return track;
					});

					db.Room.updateOne({ _id: data._id }, data)
						.then(result => res.json(result))
						.catch(err => res.status(422).json(err));
				} else res.status(304).json('No Track to Update');
			})
			.catch(err => res.status(422).json(err));
	},
	updateNowPlaying: (req, res) => {
		db.Room.findOne({ room_id: req.params.roomId })
			.then(data => {
				let updatedTrack = data.addedTracks.filter(
					track => track.spotifyId == req.params.trackId
				);

				let otherTracks = data.addedTracks.filter(
					track => track.spotifyId !== req.params.trackId
				);

				// If track is not found, assume it's not part of play queue
				if (updatedTrack.length === 0) return;

				// Set current track to now playing and all other tracks to false
				updatedTrack[0].nowPlaying = true;
				otherTracks.map(track => (track.nowPlaying = false));

				db.Room.updateOne({ _id: data._id }, data).then(result =>
					res.json(result)
				);
			})
			.catch(err => res.status(422).json(err));
	},
	updateSongProgress: (req, res) => {
		db.Room.findOne({ room_id: req.params.roomId })
			.then(data => {
				let updatedTrack = data.addedTracks.filter(
					track => track.spotifyId == req.params.trackId
				);

				// If track is not found, assume it's not part of play queue
				if (updatedTrack.length === 0) return;

				updatedTrack[0].progress = req.params.progress;

				db.Room.updateOne({ _id: data._id }, data).then(result =>
					res.json(result)
				);
			})
			.catch(err => res.status(422).json(err));
	},
	remove: function (req, res) {
		db.Room.findOne({ _id: req.params.id })
			.then(data => data.remove())
			.then(data => res.json(data))
			.catch(err => res.status(422).json(err));
	}
};
