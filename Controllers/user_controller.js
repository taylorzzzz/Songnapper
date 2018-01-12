const mongoose = require('mongoose');

const Connection2 = require('../Models/Connection2');
const User = require('../Models/User');

exports.getUser = (req, res) => {
	const id = req.query.id;
	User.findOne({_id: id})
		.then(user => {
			// now that we have the user we want to get all of the connections they have submitted;
			const submittedConnections = user.submitted_connections;
			Connection2.find({_id: submittedConnections})
				.then(results => {
					user.submitted_connections = results;
					console.log(user);
					res.json(user);
				})
		})
		.catch(err => {
			console.log('err no user found');
			res.json(err);
		})
}