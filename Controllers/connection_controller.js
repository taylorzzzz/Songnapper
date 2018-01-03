const mongoose = require('mongoose');
const request = require('request');
const axios = require('axios');
const fs = require('fs');

const Connection2 = require('../Models/Connection2');

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
	Connection2.findOneAndUpdate({'_id': id}, { $inc: {'up_votes': 1} })
		.then(c => {
			console.log('c: ' + c);
			res.json(c);
		})
		.catch(e => {
			// connection not found
			console.log(e);
			res.status(500).send(e);
		})
}

exports.downVote = (req, res) => {
	const id = req.query.id;
	Connection2.findOneAndUpdate({'_id': id}, { $inc: {'down_votes': 1} })
		.then(c => {
			res.json(c);
		})
		.catch(e => {
			console.log(e);
			res.status(500).send(e);
		})
}