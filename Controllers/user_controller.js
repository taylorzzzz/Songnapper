const mongoose = require('mongoose');

const Connection2 = require('../Models/Connection2');
const User = require('../Models/User');
const Comment = require('../Models/Comment');

exports.getUser = (req, res) => {
	const id = req.query.id;
	User.findOne({_id: id})
		.then(user => {
			// now that we have the user we want to get all of the connections they have submitted;
			const submittedConnections = user.submitted_connections;
			Connection2.find({_id: submittedConnections})
				.then(results => {
					user.submitted_connections = results;

					// next we want to fetch all of the connectins that they have liked
					Connection2.find({_id: user.connection_up_votes})
						.then(likes => {
							user.connection_up_votes = likes;
							// and finally all of their comments
							const comments = user.comments;
							Comment.find({'_id': comments})
								.then(com => {
									user.comments = com;
									res.json(user);
								})
							
						})										
				})
		})
		.catch(err => {
			console.log('err no user found');
			res.json(err);
		})
}

exports.editUserInfo = (req, res) => {

	const id = req.body.id;
	const username = req.body.username;
	const bio = req.body.bio;
	const avatar = req.body.avatar;
	User.findOneAndUpdate({_id: id}, {username: username, bio: bio, avatar: avatar}, {new: true})
		.then(user => {
			// then we need to go find each comment that the user submitted and update the saved username
			const comments = user.comments;
			Comment.update(
				{'_id': comments}, 
				{'author.username': username, 'author.avatar': avatar},
				{'multi': true})
				.then(c => {
					console.log('comments2: ', c);
					res.json(user);
				})
				.catch(error => {
					console.log('there was an error getting the comments');
				})
		})
		.catch(err => {
			console.log('there was an error getting user');
		})
}