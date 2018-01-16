const mongoose = require('mongoose');

const Connection2 = require('../Models/Connection2');
const Genres = require('../Models/Genres');
const Decades = require('../Models/Decades');

exports.getSubcategories = (req, res) => {
	let subcategories = {};

	// get genres
	Genres.find({})
		.then(genres => {
			// sort genres by count
			genres.sort((a,b) => {
				// if a is greater (negative result) then a comes first
				// if b is greater (positive result) then b comes first
				return b.count - a.count;
			});
			// then get decades
			Decades.find({})
				.then(decades => {
					decades.sort((a,b) => {
						return b.count - a.count;
					});

					subcategories.genres = genres;
					subcategories.decades = decades;

					res.json(subcategories);
				})
		});
}


exports.getTracks = (req, res) => {
	// this function gets all tracks with matching category and subcategory

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

	} else if (category === 'decades') {
		const decade = parseInt(subcategory.split('s')[0], 10);

		const decadeStart = new Date(decade+"-01-01");
		const decadeEnd = new Date(decade+9 + "-12-31");

		Connection2.find({'tracks.album.release_date' : {$gte: decadeStart, $lte: decadeEnd} })
			.then(connections => {
				// now we have all connections containing a track that was released within the decade
				let tracks = [];
				let ids = [];
				const startYear = decadeStart.getFullYear();
				const endYear = decadeEnd.getFullYear();

				connections.forEach(con => {
					con.tracks.forEach(t => {
						let year = t.album.release_date.getFullYear();
						if (year >= startYear && year <= endYear) {
							// the track was made in the decade
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
	} else if (category === 'decades') {
		const decade = parseInt(subcategory.split('s')[0], 10);

		const decadeStart = new Date(decade+"-01-01");
		const decadeEnd = new Date(decade+9 + "-12-31");

		Connection2.find({'tracks.album.release_date' : {$gte: decadeStart, $lte: decadeEnd} })
			.then(connections => {
				res.json(connections);
			})
			.catch(err => {
				console.log(err);
				res.json(err);
			})
	}
	
}

