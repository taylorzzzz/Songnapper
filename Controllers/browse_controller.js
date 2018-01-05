const mongoose = require('mongoose');

const Connection2 = require('../Models/Connection2');


exports.getSubcategories = (req, res) => {
	// first let's try to retrieve all of the genres that are used.

	let subcategories = {};

	Connection2.distinct("tracks.artist.genres")
		.then(genres => {

			Connection2.distinct("tracks.album.release_date")
				.then(dates => {
					const years = dates.map(d => {
						return d.split('-')[0];
					});

					subcategories.genres = genres;
					subcategories.years = years;
					res.json(subcategories);
				})
		})
		.catch(err => {
			return res.json(err);
		})
}


exports.getTracks = (req, res) => {
	// this function gets all tracks with matching category and subcategory
	console.log('browse_controller - getTracks() called');

	const category = req.query.category;
	const subcategory = req.query.subcategory;
	if (category === 'genres') {
		Connection2.find({'tracks.artist.genres': subcategory})
			.then(connections => {
				let tracks = [];
				let ids = [];
				console.log('found tracks');
				connections.forEach(c => {
					c.tracks.forEach(t => {
						
						if (t.artist.genres.indexOf(subcategory) !== -1) {
							// the track contains the genre
							// check if the track has already been added to list
							if (ids.indexOf(t.spotify_id) === -1) {
								ids.push(t.spotify_id);
								tracks.push(t);
							} else {
								console.log(t.spotify_id, 'is a dupe');
							}
						}

					});
				});

				res.json(tracks);
			})
			.catch(err => {
				console.log(err);
				res.json(err);
			})

	}
}

exports.getConnections = (req, res) => {
	console.log('getConnections');
	const category = req.query.category;
	const subcategory = req.query.subcategory;

	if (category === 'genres') {
		Connection2.find({'tracks.artist.genres': subcategory })
			.then(connections => {
				res.json(connections);
			})
			.catch(err => {
				console.log(err);
				res.json(err);
			})
	}
	
}

