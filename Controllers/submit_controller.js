const mongoose = require('mongoose');
const request = require('request');
const axios = require('axios');
const fs = require('fs');

const Connection2 = require('../Models/Connection2');
const Subcategories = require('../Models/Subcategories');
const User = require('../Models/User');

const Genres = require('../Models/Genres');
const Decades = require('../Models/Decades');


const SPOTIFY_BASE_URL = "https://api.spotify.com/v1/";
const credentials = require('../credentials.json');



/****************************************************/
// Search for Tracks 
exports.searchSpotifyTracks = function(req, res) {
	let url = SPOTIFY_BASE_URL + "search?q=" + req.query.track + "&type=track";
	var options = {
		headers: {'Authorization': 'Bearer ' + credentials.ACCESS_TOKEN},
		json: true
	};

	axios.get(url, options)
		.then(response => {
			let tracks = response.data.tracks.items;
			const filteredTracks = tracks.filter(track => {
				return (track.album.album_type === 'album' || track.album.album_type === 'single')
			});

			// here we could check for how many connections each track has.
			let connections = [];
			let ids = [];
			
			filteredTracks.forEach(t => {
				ids.push(t.album.id);
				connections.push(Connection2.find({'tracks.spotify_id': t.id }));
			})

			Promise.all(connections)
				.then(c => {
					const idString = ids.join(',');
					const albumURL = SPOTIFY_BASE_URL + 'albums?ids=' + idString;
					c.forEach((con, i) => {
						filteredTracks[i].connections = con;
					})
					// Do one more request to spotify API to get the albums for each search result
					// so that we can get the release_date for each.
					axios.get(albumURL, options)
						.then(resp => {
							resp.data.albums.forEach((album, i) => {
								filteredTracks[i].album.release_date = album.release_date;
								filteredTracks[i].album.release_date_precision = album.release_date_precision;
							});
							res.json(filteredTracks);
						})
					
				})
		})
		.catch(err => {
			console.log('error');
			refresh_access_token(module.exports.searchSpotifyTracks, [req, res]);
		})
}

// Creating a Connection
exports.create_connection = (req, res) => {
	const user = req.user._id;
	const trackOne = req.body.trackOne;
	const trackTwo = req.body.trackTwo;

	create_track_subdoc(trackOne)
	.then(tOne => create_track_subdoc(trackTwo)
	.then(tTwo => {


		let tracks = null;
		if (tOne.album.release_date.split('-')[0] > tTwo.album.release_date.split('-')[0]) {
 			tracks = [tTwo, tOne];
		} else {
			tracks = [tOne, tTwo];
		}

		update_subcategories(tracks);

		Connection2.create({
			tracks: tracks,
			submitted_by: user

		})
		.then(newConnection => {
			User.update(
				{_id: user},
				{$push : { submitted_connections: newConnection._id }})
			.then(result => {
				console.log(result);
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
				return refresh_access_token(module.exports.get_artist_genres, [artist]);
			}
			return artist_subdoc;
		})
	
	/*
		.then( genres => {
			console.log('got genres');
			console.log(genres);
			artist_subdoc.genres = genres;
			return artist_subdoc;
		});
	*/
}
exports.get_artist_genres = (artist) => {
	const url = SPOTIFY_BASE_URL + "artists/" + artist.spotify_id;
	const options = {
		headers: {'Authorization': 'Bearer ' + credentials.ACCESS_TOKEN},
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
const refresh_access_token = (callback, arguments) => {
	console.log('refresh_access_token running...');

	const url = 'https://accounts.spotify.com/api/token';
	var authOptions = {
		method: 'post',
		url: url,
		params: {
			grant_type: 'client_credentials',
		},
		headers: {
			'Accept':'application/json',
        	'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + (new Buffer(credentials.CLIENT_ID + ':' + credentials.CLIENT_SECRET).toString('base64')),
			
		},
		json: true
	};
	axios(authOptions)
		.then(response => {
			if (response.status===200) {
				credentials.ACCESS_TOKEN = response.data.access_token;
				fs.writeFile(__dirname + '/../credentials.json', JSON.stringify(credentials), (err) => {
					if (err) throw err;
					callback([...arguments]);
				});
			}
		})
		.catch(error => {
			console.log('error');
		})	
}



// Function for updating the Subcategories Collection 
const update_subcategories = (tracks) => {
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
			).then(result => {
				//console.log(result);
			})
		})


		let year = t.album.release_date.split('-')[0];
		let decade = Math.floor(year/10) * 10;
		decade += 's';
		
		console.log(decade);
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
		).then(result => {
			console.log(result);
		})
	});
}





