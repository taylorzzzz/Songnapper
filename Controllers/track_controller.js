const mongoose = require('mongoose');
const request = require('request');
const axios = require('axios');
const fs = require('fs');

const Connection2 = require('../Models/Connection2');

exports.getTrack = (req, res) => {
	const id = req.query.id;
	Connection2.find({'tracks._id': id}, (err, c) => {				
		if (err) return res.json({'error': err});

		const connections = c.map(con => {
			if (con.tracks[0]._id.toString() === id) {
				return con.tracks[1];
			} else {
				return con.tracks[0];
			}
		});

		let track = null;


		if (c[0].tracks[0]._id.toString() === id) {
			track = c[0].tracks[0];
		} else if (c[0].tracks[1]._id.toString() === id) {
			track = c[0].tracks[1];
		}
		let trackAndConnections = Object.assign({}, track);
		console.log(trackAndConnections.__parentArray);
		res.json(trackAndConnections);
	});
}