const mongoose = require('mongoose');

const Connection = require('../Models/Connection2');

const LATEST_COUNT = 3;

exports.getFeatured = (req, res) => {
	let id = req.query.id;

	console.log(process.env);

	if (process.env.NODE_ENV === 'production') {
		console.log('we in the production environment');
		id = '5aaeb0e5aed0af0014a7de5c'
	}

	Connection.findById(id)
		.then(c => {
			if (c) {
				res.json(c);
			} else {
				console.log('failed to find featured connection');
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