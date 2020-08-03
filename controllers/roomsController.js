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
		console.log(req.body);
		db.Room.create(req.body)
			.then(data => res.json(data))
			.catch(err => res.status(422).json(err));
	},
	update: function (req, res) {
		db.Room.findOne({ room_id: req.params.id })
			.then(data => {
				let currentTracks = data.addedTracks;

				currentTracks.push(req.body);

				db.Room.findByIdAndUpdate(data._id, data)
					.then(result => res.json(result))
					.catch(err => res.status(422).json(err));
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
