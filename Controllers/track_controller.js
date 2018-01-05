const mongoose = require('mongoose');
const request = require('request');
const axios = require('axios');
const fs = require('fs');

const Connection2 = require('../Models/Connection2');

// this function searches the database for all connections that contain a track (inside of it's 
// tracks property) which has the _id passed along in  req.queryid.
exports.getTrack = (req, res) => {
	const spotify_id = req.query.id;

	Connection2.find( {'tracks.spotify_id': spotify_id}, (err, c) => {	
		if (err) return res.json({'error': err});
		console.log('The find query for spotify_id has executed');
		// We now have a list of connections containing the track. 
		// We now need to go through these connections and extract the other track
		// These other tracks will be the connected tracks and they can be placed together in
		// an array and assigned to a connections field of our main track.
		let track = null;
		const connections = c.map(con => {
			// For each connection find the track whose spotify_id does not match the 
			// spotify_id passed along - ie the connected track
			if (con.tracks[0].spotify_id === spotify_id) {
				// Then we know that the second track is the connected track.
				// If track has not yet been set, set it to the matching track.
				if (!track) track = con.tracks[0];
				return con.tracks[1];
			} else {
				// Else it must be the first track that is the connected track.
				// If track has not yet been set, set it to the matching track.
				if (!track) track = con.tracks[1];
				return con.tracks[0];
			}
		});
		// Now our connections variable should contain an array of "connected" tracks
		// While our track variable should contain the track object.

		// This track object is actually a Mongoose Document Object since we set it to
		// one of the track objects contained in the connection array returned by our 
		// find query. 

		// Since we want to update this track object with a connectedTracks field before
		// we send it back to the front-end, we will need to convert it from a mongoose doc object
		// to a normal javascript object.

		const trackObj = track.toObject();
		trackObj.connectedTracks = connections;
		trackObj.test = "this is a test field";



		res.json(trackObj);
	});
}