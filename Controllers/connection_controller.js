const mongoose = require('mongoose');
const request = require('request');
const axios = require('axios');
const fs = require('fs');

const Connection2 = require('../Models/Connection2');
const User = require('../Models/User');


exports.getConnection = (req, res) => {
	const id = req.query.id;
	
	Connection2.findOne({'_id': id}, (err, c) => {		
		if (err) return res.json({'error': err});
		// else send back the connection
		res.json(c);
	});
}

exports.upVote = (req, res) => {
	const id = req.query.id;
	const userID = req.query.userID;
	const swap = req.query.swap;
	console.log('upVote incoming');
	console.log('swap', swap);
	// if swap is true then we need to first remove the votes current
	if (swap === "true") {
		Connection2.findOneAndUpdate({'_id': id}, {$inc: { 'down_votes': -1, 'up_votes': 1 } }, {new: true})
			.then(c => {
				User.findOneAndUpdate(
					{'_id': userID}, 
					{ $push: {'connection_up_votes': c._id}, $pull: {'connection_down_votes': c._id} }, 
					{new: true})
					.then(u => {
						res.json({user: u, connection: c});
					})
					.catch(e => {
						console.log(e);
						res.status(500).send(e);
					})
			})
			.catch(err => {
				console.log(err);
				console.log('err on swapping downvote to upvote');
			})
	} else {
		Connection2.findOneAndUpdate({'_id': id}, { $inc: {'up_votes': 1} }, {new: true})
			.then(c => {
				User.findOneAndUpdate({'_id': userID}, {$push: {'connection_up_votes': c._id}}, {new: true} )
					.then(u => {
						res.json({user: u, connection: c});
					})
				
			})
			.catch(e => {
				console.log(e);
				res.status(500).send(e);
			})
	}
}
exports.downVote = (req, res) => {
	const id = req.query.id;
	const userID = req.query.userID;
	const swap = req.query.swap;
	console.log('downVote incoming');
	console.log('swap', swap);
	// if swap is true then we need to first remove the votes current state
	if (swap === "true") {
		// swap from up vote to down vote
		Connection2.findOneAndUpdate({'_id': id}, {$inc: { 'up_votes': -1, 'down_votes': 1 }}, {new: true})
			.then(c => {
				User.findOneAndUpdate(
					{'_id': userID}, 
					{$push: {'connection_down_votes': c._id} , $pull: {'connection_up_votes': c._id} }, 
					{new: true})
					.then(u => {
						res.json({user: u, connection: c});
					})
					.catch(e => {
						console.log(e);
						res.status(500).send(e);
					})
			})
			.catch(err => {
				console.log('err swapping upvote to downvote');
			})
	} else {
		Connection2.findOneAndUpdate({'_id': id}, { $inc: {'down_votes': 1} }, {new: true})
			.then(c => {
				console.log('c - hopefully the updated c', c);
				User.findOneAndUpdate({'_id': userID}, {$push: {'connection_down_votes': c._id}}, {new: true} )
					.then(u => {
						res.json({user: u, connection: c});
					})
				
			})
			.catch(e => {
				console.log(e);
				res.status(500).send(e);
			})
	}
}

