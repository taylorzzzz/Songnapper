const mongoose = require('mongoose');
const request = require('request');
const axios = require('axios');
const fs = require('fs');

const Connection2 = require('../Models/Connection2');
const User = require('../Models/User');
const Genres = require('../Models/Genres');
const Decades = require('../Models/Decades');
const Types = require('../Models/Types');

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1/";
const CREDENTIALS = require('../config/spotify_credentials.json');



/****************************************************/
// Search for Tracks 
exports.searchSpotifyTracks = function(req, res, num = 0) {
	// This checks to see how many times searchSpotifyTracks has run for the current request.
	// If the access token needs to be refreshed then the num will get up to 1 (from 0) but 
	// for some reason in some instances an infinite loop would start up and so this prevents that from happening.
	if (num >= 2) {
		return res.json({err: 'There was a problem getting the tracks from spotify'});
	}

	// If this is a "Load More" scenario then there will be a next query containing the entire Next URL.
	let next = req.body.nextURL;
	// Get the track string which we will search Spotify's API for
	let track = req.body.track;

	// Replace curly quotes (which some mobile devices use) with straight quotes 
	// so that the spotify queries work properly.
	track = track.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

	// Construct the API call URL. If a next url was passed then go with that, otherwise construct a new url.
	let url = next || `${SPOTIFY_BASE_URL}search?q=${track}&type=track`;
	
	// Spotify API requires requests of this type to have an ACCESS_TOKEN, so we set that in the header along with instructions to return JSON.
	var options = {
		headers: {'Authorization': 'Bearer ' + CREDENTIALS.ACCESS_TOKEN},
		json: true
	};
	
	// We need to update the request so that we can include pagination with our spotify search results.
	axios.get(url, options)
		.then(response => {
			// If we have gotten here, it means that our ACCESS_TOKEN was valid and that we have been sent back results.
			let tracks = response.data.tracks.items;
			// To avoid a bunch of duplicates, we can filter out the compilations and just accept tracks from albums and singles
			const filteredTracks = tracks.filter(track => {
				return (track.album.album_type === 'album' || track.album.album_type === 'single')
			});
			// Next for each search results, we want to check our db to see if any connections have
			// been submitted containing this track, that way we can prevent two tracks that are already connected
			// from being connected again. 
			let connections = [];
			let ids = [];
			filteredTracks.forEach(t => {
				// For each track, push the album id to our ids array ...
				ids.push(t.album.id);
				// and push the results of our find db query to our connections array.
				connections.push(Connection2.find({'tracks.spotify_id': t.id }));
				// Since Connection2.find is an asyncrounous action, the loop will move on to the next  
				// iteration before the prevous find statement finishes it's query. Thus
				// connections will contain a bunch of promises (since that is what we are pushing to it)
			})
			// At this point we have an array of mongoose queries, which are basically promises. Thus we can use the 
			// all method of Promise to add a then statement for when "all" of the promises in the array are resolved.
			Promise.all(connections)
				.then(c => {
					// Now we have an array of Connections (c) for each track as well as an array of 
					// ids for each track.
					// *Note* most of the search results will not have been submitted as connections yet and so 
					// our list of ocnnections, c, is mostly a bunch of empty arrays.

					// Remember, filteredTracks was our list of search results, filtered to exlclude compilation tracks. Now we 
					// want to update each of these tracks with a connections field that holds an array of it's existing connections. 
					c.forEach((con, i) => {
						filteredTracks[i].connections = con;
					})

					// Next we want to query spotify for all of the albums of our search results. We do this by passing
					// the list of comma seperated album ids in the API URL. 
					const idString = ids.join(',');
					const albumURL = SPOTIFY_BASE_URL + 'albums?ids=' + idString;
					// The reason we want the album info for each search of our search results is because 
					// the track result doesn't contain the release_date info which we want, so we send one more Spotify query.
					axios.get(albumURL, options)
						.then(resp => {
							// Update our list of search results (filteredTracks) to include the release date info that has been returned 
							// in our response object.
							resp.data.albums.forEach((album, i) => {
								filteredTracks[i].album.release_date = album.release_date;
								filteredTracks[i].album.release_date_precision = album.release_date_precision;
							});
							// Finally send back the tracks/search results as well as the url of the next page and the total num of results
							res.json(
								{tracks: filteredTracks, 
								nextPage: response.data.tracks.next, 
								totalResults: response.data.tracks.total});
						})
						.catch(err => console.log('error getting albums of tracks'));
				})
				.catch(err => console.log('promise.all failed'));
		})
		.catch(err => {
			// If an error is caught when fetching tracks from Spotify, it likely means that our ACCESS TOKEN has expired and is invalid
			// so we call a function to refresh the ACCESS TOKEN, passing it the function we want it to execute after we've refreshed the token.
			console.log('err getting tracks from spotify');
			refresh_access_token(req, res, module.exports.searchSpotifyTracks, num);
		})
}
const refresh_access_token = (req, res, next, num) => {

	// This function sends a request to Spotify's refresh access token endpoint
	// in order to get a new access token. Once it has the new token, it updates the 
	// credentials file (which right now causes nodemon to refresh thus making our get request from front end to back fail.).
	// Finally with the newly valid credentials, this function executes the callback function, passed as an argument
	// which in this case will be the searchSpotifyTracks function (again).
	const url = 'https://accounts.spotify.com/api/token';
	// The refresh api token endpoint requires the Client_ID and the Client_Secret (encrypted).
	var authOptions = {
		method: 'post',
		url: url,
		params: {
			grant_type: 'client_credentials',
		},
		headers: {
			'Accept':'application/json',
        	'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + (new Buffer(CREDENTIALS.CLIENT_ID + ':' + CREDENTIALS.CLIENT_SECRET).toString('base64')),
			
		},
		json: true
	};
	axios(authOptions)
		.then(response => {
			// When we get a response, we want to first make sure that it was successful by checking for 200 status code.
			if (response.status===200) {
				// Within the returned data, is the newly valid access token. Update the CREDENTIALS and then write these 
				// updated credentials to file.
				CREDENTIALS.ACCESS_TOKEN = response.data.access_token;
				fs.writeFile(__dirname + '/../config/spotify_credentials.json', JSON.stringify(CREDENTIALS), (err) => {
					// Once we've successfuly written the new credentials to file, execute the callback (searchSpotifyTracks) passing the arguments.
					if (err) throw err;

					num = num + 1;
					console.log('updated num: ', num)
					next(req, res, num);
				});
			} else { console.log(response.status, "Something went wrong")}
		})
		.catch(error => console.log('error'));	
}



 // Creating a Connection
exports.create_connection = (req, res) => {
	const user = req.user._id;
	const trackOne = req.body.trackOne;
	const trackTwo = req.body.trackTwo;
	const types = req.body.types;
	const submissionStatement = req.body.statement;

	create_track_subdoc(trackOne)
	.then(tOne => create_track_subdoc(trackTwo)
	.then(tTwo => {

		let tracks = null;
		if (tOne.album.release_date.split('-')[0] > tTwo.album.release_date.split('-')[0]) {
 			tracks = [tTwo, tOne];
		} else {
			tracks = [tOne, tTwo];
		}

		update_subcategories(tracks, types);

		Connection2.create({
			tracks: tracks,
			submitted_by: user,
			types: types,
			submission_statement: submissionStatement
		})
		.then(newConnection => {
			User.update(
				{_id: user},
				{$push : { submitted_connections: newConnection._id }})
			.then(result => {
				res.json(newConnection);
			})
		})
		.catch(err => {
			console.log('there was an error: ', err);
			res.json({message: err});
		})
	}))
}
// Functions for creating the connection
const create_album_subdoc = (track) => {
	let date = null;
	if (track.album.release_date_precision === 'day') {
		date = track.album.release_date;
	} else if (track.album.release_date_precision === 'month') {
		date = track.album.release_date + "-01";
	} else {
		date = track.album.release_date + "-01-01";
	}
	const album_subdoc =  {
		name: track.album.name, 
		spotify_id: track.album.id,
		cover_img: track.album.images[0].url,
		release_type: track.album.album_type,
		release_date: date
	}
	return album_subdoc;
}
const create_artist_subdoc = (track) => {
	const artist_subdoc = {
		name: track.artists[0].name,
		spotify_id: track.artists[0].id,
		genres: [ ]
	}
	return module.exports.get_artist_genres(artist_subdoc)
		.then(response => {
			artist_subdoc.genres = response.data.genres;
			return artist_subdoc;
		})
		.catch(error => {
			console.log('error getting genres');
			if (error.response.status === 401) {
				console.log('error getting artist genres. will now go get refresh token');
				return refresh_access_token(module.exports.get_artist_genres, [artist]);
			}
			return artist_subdoc;
		})
	
}
exports.get_artist_genres = (artist) => {
	const url = SPOTIFY_BASE_URL + "artists/" + artist.spotify_id;
	const options = {
		headers: {'Authorization': 'Bearer ' + CREDENTIALS.ACCESS_TOKEN},
		json: true
	};
	return axios.get(url, options)	
}
const create_track_subdoc = (track) => {
	const album = create_album_subdoc(track);
	const Promise = create_artist_subdoc(track)
		.then(artist => {
			const track_subdoc = {
				spotify_id: track.id,
				title: track.name,
				album: album, 
				artist: artist,
				tropes:  [],
			}
			return track_subdoc
	})
	return Promise;
}

// Function for updating the Subcategories Collection 
const update_subcategories = (tracks, types) => {
	// For each track we want to go through all of the genres in the 
	// Subcategories collection to see if the track has any genres that are not 
	// in the collection. If it does then we update Subcategories with those genres
	// for both tracks
	tracks.forEach(t => {
		// get all of the genres for that track
		let genres = t.artist.genres;
		// for each genre
		genres.forEach(g => {
			// update the Genres collection
			Genres.update(
				{ value: g }, 
				{ 
					$inc: { count: 1 },
					$set: {
						value: g,
						image: t.album.cover_img
					}
				}, 
				{ upsert: true }
			).then(result => {		// For some reason this then statement needs to be here for a new documents to be created
			})
		})


		let year = t.album.release_date.split('-')[0];
		let decade = Math.floor(year/10) * 10;
		decade += 's';
		
		Decades.update(
			{ value: decade },
			{
				$inc: { count: 1 },
				$set: {
					value: decade,
					image: t.album.cover_img
				}
			},
			{ upsert: true }
		).then(result => {		// For some reason this then statement needs to be here for a new documents to be created
		})
	});
	// then update the types collection

	
	types.forEach((t,i) => {
			// for each type - say ['Melody', 'Bassline']
			// update the Types collection by either 
			// creating a new document or incrementing the count and changing link art
			Types.update( {value: t}, 
				{ 
					$inc: { count: 1 },
					$set: {
						value: t,
						image: tracks[i % 2].album.cover_img
					}
				},
				{ upsert: true }
			).then(result => {		// For some reason this then statement needs to be here for a new documents to be created
			})
		});
}





