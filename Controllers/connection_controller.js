const mongoose = require('mongoose');
const request = require('request');
const axios = require('axios');
const fs = require('fs');

const Connection2 = require('../Models/Connection2');
const User = require('../Models/User');
const Comment = require('../Models/Comment');


const VOTE_WEIGHT = 5;

exports.getConnection = (req, res) => {
	const id = req.query.id;
	Connection2.findOne({'_id': id}, (err, c) => {		
		if (err) return res.json({'error': err});
		// else send back the connection
		// then we need to get the identities of the users who posted the comments
		User.findOne({'_id': c.submitted_by})
			.then(user => {
				// And finally, for both tracks we want to fetch all of the connections it is involved in
				const trackOne = c.tracks[0]._id;
				const trackTwo = c.tracks[1]._id;


				res.json([c, user]);
			})
		
	});
}

exports.getComments = (req, res) => {
	const connection = req.body.connection;
	Connection2.findOne({'_id': connection})
		.then(connection => {
			const comments = connection.comments;
			Comment.find({'_id': comments})
			.then(c => {
				res.json(c);
			})
			.catch(e => {
				console.log(e);
				res.json(e);
			})
		})
}


exports.vote2 = (req, res) => {
	const connectionID = req.body.connection._id;
	const userID = req.body.userID;
	const swap = req.body.swap;
	const up = req.body.upVote;
	// get the current/previous vote counts
	const upVotes = req.body.connection.up_votes;
	const downVotes = req.body.connection.down_votes;
	// Set the weighted votes 
	let weightedUpVotes = upVotes + VOTE_WEIGHT;
	let weightedDownVotes = downVotes + VOTE_WEIGHT;
	// Set the increment amounts based on up or down vote and whether or not a swap is required
	const upIncrement = up ? 1 : ( swap ? -1 : 0 );
	const downIncrement = up ? ( swap ? -1 : 0 ) : 1;
	// Update the weighted Up/Down votes with the increments
	weightedUpVotes = weightedUpVotes + upIncrement;
	weightedDownVotes = weightedDownVotes + downIncrement;
	// Calculate the weighted rating ratio from the weighted up/down votes
	const updatedWeightedRating = weightedUpVotes / (weightedUpVotes + weightedDownVotes);
	const updatedRating = (upVotes + upIncrement) / (upVotes + upIncrement + downVotes + downIncrement);

	console.log(updatedWeightedRating, updatedRating);
	
	Connection2.findOneAndUpdate({ '_id': connectionID}, 
		{$inc: {up_votes: upIncrement, down_votes: downIncrement},
		'weighted_rating': updatedWeightedRating, 'rating': updatedRating}, 
		{new: true})
		.then(c => {
			const upConnectionPush = up ? c._id : null;
			const downConnectionPush = up ? null : c._id;
			const upConnectionPull = swap ? (up ? null : c._id) : null;
			let options;

			if (up) {
				if (swap) {
					// upvote and swap - push to connection_up_votes and pull from connection_down_votes
					options = { $push: {'connection_up_votes': c._id}, $pull: {'connection_down_votes': c._id} }; 
				} else {
					// upvote and no swap - push to connection_up_votes
					options = { $push: {'connection_up_votes': c._id} };
				}
			} else {
				if (swap) {
					// downVote and swap - push to connection_down_votes and pull from connection_up_votes 
					options = { $push: {'connection_down_votes': c._id}, $pull: {'connection_up_votes': c._id} };
				} else {
					// down vote and no swap - push to connection_down_votes
					options = { $push: {'connection_down_votes': c._id} };
				}
			}

			User.findOneAndUpdate(
				{'_id': userID}, options, {new: true})
				.then(u => {
					console.log('sending back user and connection');
					res.json({user: u, connection: c});
				})
				.catch(e => {
					console.log(e);
					res.status(500).send(e);
				})
		})
}

exports.vote = (req, res) => {
	const connectionID = req.query.id;
	const userID = req.query.userID;
	const swap = req.query.swap === "true" ? true : false;
	const up = req.query.dir === "up" ? true : false;

	const upIncrement = up ? 1 : ( swap ? -1 : 0 );
	const downIncrement = up ? ( swap ? -1 : 0 ) : 1;
	
	Connection2.findOneAndUpdate({ '_id': connectionID}, {$inc: {up_votes: upIncrement, down_votes: downIncrement}}, {new: true})
		.then(c => {
			// then we need to update the rating and weighted_rating values using the 
			// next we need to update the user by adding the _id of the connection to the 
			// up or down vote field 
			const upConnectionPush = up ? c._id : null;
			const downConnectionPush = up ? null : c._id;
			const upConnectionPull = swap ? (up ? null : c._id) : null;
			let options;

			if (up) {
				if (swap) {
					// upvote and swap - push to connection_up_votes and pull from connection_down_votes
					options = { $push: {'connection_up_votes': c._id}, $pull: {'connection_down_votes': c._id} }; 
				} else {
					// upvote and no swap - push to connection_up_votes
					options = { $push: {'connection_up_votes': c._id} };
				}
			} else {
				if (swap) {
					// downVote and swap - push to connection_down_votes and pull from connection_up_votes 
					options = { $push: {'connection_down_votes': c._id}, $pull: {'connection_up_votes': c._id} };
				} else {
					// down vote and no swap - push to connection_down_votes
					options = { $push: {'connection_down_votes': c._id} };
				}
			}

			User.findOneAndUpdate(
				{'_id': userID}, options, {new: true})
				.then(u => {
					res.json({user: u, connection: c});
				})
				.catch(e => {
					console.log(e);
					res.status(500).send(e);
				})
		})
}

exports.submitComment = (req, res) => {

	const comment = req.body.comment;
	const connection = req.body.connection;
	const userID = req.body.user._id;
	const username = req.body.user.username;
	const avatar = req.body.user.avatar;

	const commentSubdoc = {
		content: comment,
		author: {
			userID: userID,
			username: username,
			avatar: avatar
		},
		likes: 0
	}

	Comment.create({
		content: comment,
		author: {
			userID: userID,
			username: username,
			avatar: avatar
		},
		likes: 0
	}).then(com => {
		Connection2.findOneAndUpdate({'_id': connection}, {$push: {'comments': com._id }}, {new: true, upsert: true})
		.then(c => {
			// finally update the users document
			User.findOneAndUpdate({'_id': userID}, {$push: {'comments': com._id }})
			.then(u => {
				res.json(c);
			})
		})
		.catch(err => {
			console.log('error');
			console.log(err);
			res.json(err);
		})
	})
}

