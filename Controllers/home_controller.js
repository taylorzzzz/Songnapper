const mongoose = require('mongoose');

const Connection = require('../Models/Connection2');

const LATEST_COUNT = 3;
exports.getFeatured = (req, res) => {
	const id = req.query.id;

	Connection.findById(id)
		.then(c => {
			if (c) {
				res.json(c);
			} else {
				console.log('did not find original so looking for new');
				// Failed to find original connection so return default
				Connection.findOne()
					.then(c => {
						res.json(c);
					})
			}
			
		})
		.catch (err => {
			console.log('err');
		})
}


exports.getLatest = (req, res) => {
	// Get 10 newest connections
	Connection.find({})
		.limit(LATEST_COUNT)
		.sort({ $natural: -1 })
		.then(c => {
			res.json(c);
		})
		.catch (err => {
			console.log('err');
			res.json(err);
		})
}