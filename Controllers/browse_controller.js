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


	// this method uses the Connections2 collection
	/*

	Connection2.distinct("tracks.artist.genres")
		.then(genres => {
			// convert genre strings into objects
			genreObjs = genres.map(g => {
				return { value: g };
			});

			// Get all distinct release_dates
			Connection2.distinct("tracks.album.release_date")
				.then(dates => {
					// convert dates to decades
					const decades = dates.map(d => {
						let year =  d.getFullYear();
						let decade = Math.floor(year/10) * 10;
						return decade.toString() + 's';
					});


					// Filter decades to get counts
					let filteredDecades = [];
					decades.forEach((d, i) => {
						const ind = filteredDecades.findIndex(el => {
							return el.value === d;
						})

						if (ind === -1) {
							filteredDecades.push({value: d, count: 1});
						} else {

							filteredDecades[ind].count++;
						}
					});

					// Here we might want to sort our subcategories by counts


					subcategories.genres = genreObjs;
					subcategories.decades = filteredDecades;
					res.json(subcategories);
				})
		})
		.catch(err => {
			return res.json(err);
		})

	*/
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

