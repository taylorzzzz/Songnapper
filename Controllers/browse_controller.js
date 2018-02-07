const mongoose = require('mongoose');

const Connection2 = require('../Models/Connection2');
const Genres = require('../Models/Genres');
const Types = require('../Models/Types');

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
					Types.find({})
						.then(types => {
							types.sort((a, b) => { 
								return b.count - a.count
							});
							subcategories.types = types;
							subcategories.genres = genres;
							subcategories.decades = decades;

							res.json(subcategories);
						})			
				})
		});
}


exports.getTracks = (req, res) => {
	// This method returns the tracks that match the passed subcategory.
	// For instance, it might fetch all of the tracks (or as many as we are displaying per page since
	// we are using pagination) that were released during the 1990s.
	const category = req.query.category;			// i.e Decade
	const subcategory = req.query.subcategory;		// i.e 1990s

	// Determine the field that we will sort our results by.
	// Either submitted_on to find the latest submissions or 
	// release_date to find the oldest/newest tracks.
	const sort = req.query.sort === 'newest' 
		? 'submitted_on' : 'release_date';

	// Then get the current results page that the user is browsing.
	const page = req.query.page || 0;
	// We will display 10 results for each page.
	const perPage = 10;
	// Construct the mongoose query which we'll pass to the sort method.
	// Will look something like:  {'submitted_on' : -1 }
	const query = {};
	query[sort] = -1;

	// These are the arrays where we will store the matching tracks. 
	let tracks = [];
	let ids = [];

	if (category === 'genres') {
		// We need to find all tracks that contain the genre stored in "subcategory"
		Connection2.find({'tracks.artist.genres': subcategory})
 			.sort(query)
			.limit(perPage)
			.skip(page * perPage)
			.then(connections => {
				// For each connection (there are at most 10) ...
				connections.forEach(c => {
					// For both tracks in that make up that connection ...
					c.tracks.forEach(t => {
						// Check if the track includes the relevant genre (subcategory) ...
						if (t.artist.genres.indexOf(subcategory) !== -1) {
							// And if it does, check that the track has not already been added to
							// our list of matches (in case track was apart of another connection).
							if (ids.indexOf(t.spotify_id) === -1) {
								// If not, add that track to the list of track matches (tracks) 
								// and add the spotify_id to the list of ids (ids - used quicker checking of duplicates)
								ids.push(t.spotify_id);
								tracks.push(t);
							}
						}
					});
				});
				// Once we have looped through each connection and collected all the tracks that 
				// include the genre we are checking for (there should be at most 10),
				// we need to determine how many total pages of tracks we will have. 

				// * NOTE - since one track can be in multiple connections, it is possible that 
				// we could end up with a high count (lots of connections) but a low number of actual matching tracks. 
				Connection2.count({'tracks.artist.genres': subcategory})
					.then(count => {
						res.json({tracks: tracks, count: count, currentPage: page})
					})
			})
			.catch(err => res.json(err))
	} else if (category === 'decades') {
		// We need to find all of the tracks that were released within the decade stored in "subcategory".

		// First we extract the decade from subcategory e.g 2010 from "2010s".
		const decade = parseInt(subcategory.split('s')[0], 10);

		// Then we need to get the start and end dates of that decade.
		const decadeStart = new Date(decade+"-01-01");
		const decadeEnd = new Date(decade+9 + "-12-31");

		// Find all connections containing at least one track that was made after the 
		// start date of the decade and before the end date of the decade.
		Connection2.find({'tracks.album.release_date' : {$gte: decadeStart, $lte: decadeEnd} })
 			.sort(query)
			.limit(perPage)
			.skip(page * perPage)
			.then(connections => {
				// We will determine if the tracks were released within the decade by checking if the year they were released 
				// falls within the start and end years of the decade e.g 1990 & 1999. So we start by extracting these start and end years.
				const startYear = decadeStart.getFullYear();
				const endYear = decadeEnd.getFullYear();

				// Then for each connection (that was a match i.e contained at least one track released during the decade) ...
				connections.forEach(con => {
					// Go through both tracks ...
					con.tracks.forEach(t => {
						// and for each get the year that the track was released.
						let year = t.album.release_date.getFullYear();
						// Check if the release year falls within the start and end years of the decade.
						if (year >= startYear && year <= endYear) {
							// If the track was released during the decade, check to see if 
							// the track has already been added to our list of track matches. 
							if (ids.indexOf(t.spotify_id) === -1) {
								// If not, add the track to our list of matches.
								ids.push(t.spotify_id);
								tracks.push(t);
							}
						}
					});
				});
				// After we have looped through each connection and gotten all of the tracks 
				// that were made during the decade, we need to determine the total number of tracks made 
				// during that decade so that we can determine the number of pages we'll need. This is actually
				// a bit of a problem because all we can (easily) do is get the number of connections that contain 
				// at least one track that was maded in the given decade. The number of tracks may be higher, e.g  
				// if both tracks in a connection were made in the 1990s there are two tracks but only one connection
				// will be counted, or lower, e.g one track can be in many connections.
				// This may be an unavoidable consequence of our current database structure and we may want to
				// look into changing this structure later. For now though we'll just keep this limitation in mind and 
				// hope that the connection and track counts do not diverge to greatly.
				Connection2.count({'tracks.album.release_date': {$gte: decadeStart, $lte: decadeEnd} })
						.then(count => {
							res.json({tracks: tracks, count: count, currentPage: page})
						})
						.catch(err => {console.log(err); res.json(err)})
			})
			.catch(err => res.json(err))
	} else if (category === 'types') {
		// For the "Types" category we don't return individual tracks, only the connections. 
		// The reason is that "Types", more so than the other categories, makes sense really only 
		// in the context of the connection (it is the "type" of connection after all) and 
		// so browsing songs by the types of connections they are apart of seems kind of awkward.
		// I may change this later but for now we'll just return null.
		res.json(null);
	}
}

exports.getConnections = (req, res) => {			// Gets connections (10 at a time) that match category & subcat
	const category = req.query.category;
	const subcategory = req.query.subcategory;
	const sort = req.query.sort === 'topRated' 
		? 'weighted_rating' : 'submitted_on';

	const page = req.query.page || 0;
	const perPage = 10;
	const query = {};
	query[sort] = -1;
	
	if (category === 'genres') {
		Connection2.find({'tracks.artist.genres': subcategory })
			.sort(query)
			.limit(perPage)
			.skip(page * perPage)
				.then(connections => {
					Connection2.count({'tracks.artist.genres': subcategory})
						.then(count => {
							res.json({connections: connections, count: count, currentPage: page})
						})
						.catch(err => {console.log(err); res.json(err)})
				})
				.catch(err => {console.log(err); res.json(err) })
	} else if (category === 'decades') {
		const decade = parseInt(subcategory.split('s')[0], 10);
		const decadeStart = new Date(decade+"-01-01");
		const decadeEnd = new Date(decade+9 + "-12-31");

		Connection2.find({'tracks.album.release_date' : {$gte: decadeStart, $lte: decadeEnd} })
			.sort(query)
			.limit(perPage)
			.skip(page * perPage)
				.then(connections => {
					Connection2.count({'tracks.album.release_date': {$gte: decadeStart, $lte: decadeEnd} })
						.then(count => {
							res.json({connections: connections, count: count, currentPage: page})
						})
						.catch(err => {console.log(err); res.json(err)})
				})
				.catch(err => {console.log(err); res.json(err) })
	} else if (category === 'types') {
		Connection2.find({'types': subcategory})
			.sort(query)
			.limit(perPage)
			.skip(page * perPage)
				.then(connections => {
					// Then get total count of all connections that match this subcategory
					Connection2.count({'types': subcategory})
						.then(count => {
							res.json({connections: connections, count: count, currentPage: page})
						})
					
				})
	}
}

exports.getLatest = (req, res) => {
	const perPage = 10;
	const page = req.query.page || 0;

	// Finds all connection documents
	// Sorts them by newest first
	// returns at most 10 documents
	// and skips 10 * whatever page we are on
	Connection2.find()
		.sort({'submitted_on': -1})
		.limit(perPage)
		.skip(page * perPage)
			.then(c => {
				Connection2.count()
					.then(count => {
						res.json({connections: c, count: count, currentPage: page})
					})
				
			})
			.catch(err => {
				console.log('there was an error getting latest tracks');
				res.json(err)
			})
}

exports.getTopRated = (req, res) => {
	console.log('getTopRated');
	const perPage = 10;
	const page = req.query.page || 0;

	// Finds all connection documents
	// Sorts them by rating_ratio first
	// returns at most 10 documents
	// and skips 10 * whatever page we are on
	Connection2.find()
		.sort({'weighted_rating': -1})
		.limit(perPage)
		.skip(page * perPage)
			.then(c => {
				c.forEach(con => {
				})
				Connection2.count()
					.then(count => {
						res.json({connections: c, count: count, currentPage: page})
					})
				
			})
			.catch(err => {
				console.log('there was an error getting latest tracks');
				res.json(err)
			})
}

