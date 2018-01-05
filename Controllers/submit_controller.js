const mongoose = require('mongoose');
const request = require('request');
const axios = require('axios');
const fs = require('fs');

const Connection2 = require('../Models/Connection2');

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1/";
const credentials = require('../credentials.json');
/****************************************************/
// Search for Tracks 
exports.searchSpotifyTracks = function(req, res) {
	console.log('running getTracksFromSpotify');
	//console.log(req);
	console.log(req.query);
	let url = SPOTIFY_BASE_URL + "search?q=" + req.query.track + "&type=track";
	var options = {
		headers: {'Authorization': 'Bearer ' + credentials.ACCESS_TOKEN},
		json: true
	};
	axios.get(url, options)
		.then(response => {
			console.log('successful response');
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
	console.log('create_connection_2 called');
	const trackOne = req.body.trackOne;
	const trackTwo = req.body.trackTwo;
	/*
	const trackOne_subdoc = create_track_subdoc(trackOne);
	const trackTwo_subdoc = create_track_subdoc(trackTwo);
	*/

	create_track_subdoc(trackOne)
	.then(tOne => create_track_subdoc(trackTwo)
	.then(tTwo => {

		Connection2.create({
			tracks: [tOne, tTwo],
		})
		.then(newConnection => {
			res.json(newConnection);
		})
		.catch(err => {
			console.log('there was an error: ', err);
			res.json({message: err});
		})
	}))
}
// functions for creating the connection
const create_album_subdoc = (track) => {
	const album_subdoc =  {
		name: track.album.name, 
		spotify_id: track.album.id,
		cover_img: track.album.images[0].url,
		release_type: track.album.album_type,
		release_date: track.album.release_date
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
			console.log('promise complete');
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

					console.log('all went well. now calling callback with the following arguments', [...arguments]);
					callback([...arguments]);
				});
			}
		})
		.catch(error => {
			console.log('error');
		})	
}