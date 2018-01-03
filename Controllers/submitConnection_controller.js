var mongoose = require('mongoose');
const request = require('request');
const axios = require('axios');
const fs = require('fs');

var Track = require('../Models/Track');
var Connection = require('../Models/Connection');
var Connection2 = require('../Models/Connection2');

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1/";
var credentials = require('../credentials.json');

/* Get Search Results from Spotify */
exports.getAccessToken = function(req, res, callback) {
	console.log('Running getAccessToken');
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {'Authorization': 'Basic ' + (new Buffer(credentials.CLIENT_ID + ':' + credentials.CLIENT_SECRET).toString('base64'))},
		form: {grant_type: 'client_credentials'},
		json: true
	};
	request.post(authOptions, (error, response, body) => {
		if (response.statusCode === 200) {
			credentials.ACCESS_TOKEN = body.access_token;
			fs.writeFile(__dirname + '/../credentials.json', JSON.stringify(credentials), (err) => {
				if (err) throw err;
				//module.exports.searchSpotifyTracks(req, res);
				callback(req, res);
			});
		} else {
			res.send({message: "something's wrong"});
		}
	})
}
exports.searchSpotifyTracks = function(req, res) {
	console.log('running searchSpotifyTracks');
	//let artist = req.query.artist;
	//let track = req.query.track;
	//let url = SPOTIFY_BASE_URL + "search?q=" + track + "%20" + "artist:" + artist + "&type=track";
	let url = SPOTIFY_BASE_URL + "search?q=" + req.query.track + "&type=track";
	var options = {
		url: url,
		headers: {'Authorization': 'Bearer ' + credentials.ACCESS_TOKEN},
		json: true
	};
	request.get(options, (error, response, body) => {
		if (response.statusCode === 401) {
			module.exports.getAccessToken(req, res, module.exports.searchSpotifyTracks)
		}
		else {
			//ConnectionController.find_connections(req, res, body)
			let tracks = body.tracks.items;
			const filteredTracks = tracks.filter(track => {
				return (track.album.album_type === 'album' || track.album.album_type === 'single')
			})
			res.json(filteredTracks);
		}	
	})
}
exports.getGenreFromSpotify = function(id) {
	var url = SPOTIFY_BASE_URL + "artists/" + id;
	var options = {
		url: url,
		headers: {'Authorization': 'Bearer ' + credentials.ACCESS_TOKEN},
		json: true
	}
	request.get(options, (err, response, body) => {
		console.log(body.genres);
		console.log('.............................');
		return body.genres;
	})
}
/************************************************************************/
exports.find_connections = function(req, res, body) {
	console.log('called find_connections');
	// basically we want this function to add a connections field to all of our track items.

	var tracks = body.tracks.items;
	tracks.forEach((track) => {
		Track.find({'spotifyId': track.id}, (err, t) => {
			track.connections = t.connections;
		});
	});
	return Promise.all(tracks);

	body.tracks.items = tracks;
	// now for each of these tracks lets make a db query to see if the track is 
	// in the db yet.
	console.log('about to send back body');
	res.json(body);

	//var trackOne = req.body.trackOne;
	//var trackTwo = req.body.trackTwo;
}
exports.create_connection = function(req, res) {
	console.log('create_connection');
	var trackOne = req.body.trackOne;
	var trackTwo = req.body.trackTwo;

	/* We begin by checking to see if the first track exists with Track.find(). 
		If it does then we check if trackTwo exists. If it does then we further have to
		check if a connection between the two already exists. If it does then we simply send back in
		res.json() a message that a connection already exists between those two tracks. If they don't 
		yet share a connection then we create one and update each track with the connection's _id in the connections
		field. If trackTwo doesn't exist on the other hand, we have to create a new Track entry for track two and then 
		the rest is the same: create connection, update tracks, return connection. 
		If trackOne doesn't exist then we first create a new Track. Next we check if trackTwo exists and the process
		basically proceeds as the one above except this time we don't have to check for an already existing connection.
	*/
	Track.find({spotifyId: trackOne.id}, (err, tOne) => {
		if (tOne.length > 0) {
			var tOneId = tOne[0]._id;
			// now we move on to trackTwo
			Track.find({spotifyId: trackTwo.id}, (err, tTwo) => {
				if (tTwo.length > 0) {
					// if this is true it means both tOne and tTwo already exist but not necessarily that the connection exists
					var tTwoId = tTwo[0]._id;
					// we need to check if the connection already exists
					var tOneConnections = tOne[0].connections;
					var tTwoConnections = tTwo[0].connections;
				
					tOneConnections.forEach((tOneConnection) => {
						tTwoConnections.forEach((tTwoConnection) => {
							if (tOneConnection._id === tTwoConnection._id) {
								// then they already share a connection
								return res.json({message: 'connection already exists'});
							}
						})
					});
				
					// if we make it to here it means that although both tracks are entered in db, they r not connected yet
					// so now let's make a new connection for them
					var newConnection = new Connection({
						trackOne_id: tOneId,
						trackTwo_id:tTwoId
					});
					// save the new connection and add it two the connection fields of the two tracks
					newConnection.save((err, connection) => {
						if (err) { return res.send(err);}
						Track.update({_id: tOneId},{"$push":{"connections":newConnection._id}})
							.exec((err, c) => {
								Track.update({_id: tTwoId},{"$push":{"connections":newConnection._id}})
								.exec((err, c) => {
									// since both tracks already exist, and thus have already had genres added, no need to do it again.
									res.json({newConnection});
								})
							})
					})
				} else {
					// this means that only track one already exists so we must create track two
					var newTrackTwo = new Track({
						spotifyId: trackTwo.id,
						title: trackTwo.name,
						album: trackTwo.album.name, 
						artist: trackTwo.artists[0].name,
						albumCover: trackTwo.album.images[1].url
					});
					newTrackTwo.save((err, track) => {
						if (err) { return res.send(err);}
						var newConnection = new Connection({
							trackOne_id: tOneId,
							trackTwo_id: newTrackTwo._id
						})
						newConnection.save((err, connection) => {
							if (err) {return res.send(err)}
							Track.update({_id: tOneId}, {"$push": {"connections": newConnection._id}})	
								.exec((err, c) => {
									Track.update({_id:newTrackTwo._id}, {"$push":{"connections": newConnection._id}})
										.exec((err, c)=> {
											// since trackOne already exists, we'll pass null in it's place
											module.exports.get_genre([null, trackTwo]);
											res.json(newConnection);
										})
								})
						})
					})
				}
			})
			// at this point we have covered the following 3 cases:
			//		trackOne exists & trackTwo exists but they are not connected
			//		trackOne exists & trackTwo exists and they are already connected 
			//		trackOne exists & trackTwo doesn't yet exist
			// Now let's cover the cases where trackOne doesn't exist ie. (!tOne.length > 0)
		} else {
			// trackOne is not yet created so we need to create it.
			var newTrackOne = new Track({
				spotifyId: trackOne.id,
				title: trackOne.name,
				album: trackOne.album.name, 
				artist: trackOne.artists[0].name,
				albumCover: trackOne.album.images[1].url
			});
			newTrackOne.save((err, track) => {
				if (err) {return res.send(err)}
				// now we need to check on trackTwo
				Track.find({spotifyId: trackTwo.id}, (err, tTwo) => {
					if (err) {return res.send(err)}
					if (tTwo.length > 0) {
						// trackTwo already exists so we just need to create the new connection
						var tTwoId = tTwo[0]._id;
						var newConnection = new Connection({
							trackOne_id: newTrackOne._id,
							trackTwo_id: tTwoId
						});
						newConnection.save((err, connection) => {
							if (err) {return res.send(err)}
							Track.update({_id: newTrackOne._id}, {"$push": {"connections": newConnection._id}})
								.exec((err, c) => {
									if (err) {return res.send(err)}
									Track.update({_id: tTwoId}, {"$push": {"connections": newConnection._id}})
										.exec((err, c) => {
											if (err) {return res.send(err)};
											// 
											res.json(newConnection);
										})
								})
						})
					} else {
						// trackTwo doesn't yet exist so we need to first create a new track for it
						var newTrackTwo = new Track({
							spotifyId: trackTwo.id,
							title: trackTwo.name,
							album: trackTwo.album.name, 
							artist: trackTwo.artists[0].name,
							albumCover: trackTwo.album.images[1].url
						});
						newTrackTwo.save((err, track) => {
							if (err) {return res.send(err)}
							// now we need to create the connection
							var newConnection = new Connection({
								trackOne_id: newTrackOne._id,
								trackTwo_id: newTrackTwo._id
							});
							newConnection.save((err, connection) => {
								if (err) {return res.send(err)}
								Track.update({_id: newTrackOne._id}, {"$push": {"connections": newConnection._id}})
									.exec((err, c) => {
										if (err) {return res.send(err)}
										Track.update({_id: newTrackTwo._id}, {"$push": {"connections": newConnection._id}})
											.exec((err, c) => {
												if (err) {return res.send(err)}
												console.log('pre get_genre');
												module.exports.get_genre([trackOne, trackTwo]);
												res.json(newConnection);
											})
									})
							})
						})
					}
				})
			})
			// at this point we have covered the remaining 2 cases:
			//		trackOne doesn't exist & trackTwo does exist
			// 		trackOne doesn't exist & trackTwo does exist
		}
	})
}
exports.get_genre = function(tracks) {
	tracks.forEach((track) => {
		if (track) {
			var artistId = track.artists[0].id;
			var url = SPOTIFY_BASE_URL + "artists/" + artistId;
			var options = {
				url: url,
				headers: {'Authorization': 'Bearer ' + credentials.ACCESS_TOKEN},
				json: true
			};
			request.get(options, (err, response, body) => {
				console.log('.............................');
				Track.update({spotifyId: track.id}, {"genres": body.genres}, (err, t) => {
					if (err) {return res.send(err)};
					console.log(t);
				})
			})	
		} else {
			console.log('null track');
		}
	})
	console.log('genres set');
}
/************************************************************************/
// VERSION 2



exports.create_connection_2 = (req, res) => {
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
				refresh_access_token(module.exports.get_artist_genres, [artist]);
			}
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













/************************************************************************/
/* Get tracks that match category and subcategory – (decade - 1960s) */
exports.getTracks = function(req, res) {
	
	const category = req.query.category;
	const subcategory = req.query.subcategory;
	
	// categories - genres, decade, type
	if (category === 'genres') {
		// find all tracks which include subcategory in their genres
		Track.find({'genres': subcategory}, (err, tracks) => {
			if (err) return res.json(err);
			res.json(tracks);
		})
	} else if (category === 'decades') {
		res.json({message: 'try the category, genres'});
	} else {
		res.json({message: 'try the category, genres'})
	}

	
}
/* Get connections that match category and subcategory */
// First find all tracks that match a category 
// Then for each track, get all the connections
exports.getConnections = function(req, res) {
	const category = req.query.category;
	const subcategory = req.query.subcategory;
	let connections = [];
	console.log(category, subcategory);
	if (category === 'genres') {
		Track.find({'genres': subcategory})
			.then(tracks => {
				tracks.forEach(track => {
					track.connections.forEach(c => {
						connections.push(c.toString());
					})
				})
				return Promise.all(connections);
			})
			.then((connectionIds) => {
				const filteredConnections = connectionIds.filter((id, pos) => {
					console.log(typeof(id));
					return connectionIds.indexOf(id) === pos;
				});
				let connectionObjects = [];
				filteredConnections.forEach(c => {
					connectionObjects.push(Connection.find({_id: c}));
				})
				return Promise.all(connectionObjects);
			})
			.then((connectionsArr) => {
				res.json(connectionsArr);
			})
/*
		Track.find({'genres': subcategory}, (err, tracks) => {
			if (err) return res.json(err);
			// for each track with matching genre
			tracks.forEach(track => {
				// go through the connections and for each connection
				track.connections.forEach(connection => {
					console.log(connection);
					// find it in the Connection Collection
					Connection.findOne({_id: mongoose.Types.ObjectId(connection)}, (err, c) => {
						if (err) res.json(err);
						console.log('found connection');
						console.log(track._id);
						if (c.trackOne_id.toString() === track._id.toString()) {
							console.log('track one matches');
						} else if (c.trackTwo_id.toString() === track._id.toString()){
							console.log('track two matches');
						}
						connections.push(connections);
					})
				})
			
			})
		})
*/
	}
}

exports.getConnections2 = function(req, res) {
	console.log('running getConnections2');
	const category = req.query.category;
	const subcategory = req.query.subcategory;

	console.log(category, subcategory);

	res.json({message: 'Working on it...'});
}
/************************************************************************/
exports.selectedTrackConnections = function(req, res) {
	const id = req.query.id;
	console.log(id);
	Track.find({spotifyId: id}, (t) => {
		if (t) {
			console.log(t);
			res.json(t.connections);
		} else {
			res.json([]);
		}
		
	})
}

exports.getConnectionsAndTracks = function(req, res) {
	const category = req.query.category;
	const subcategory = req.query.subcategory;
	console.log(category, subcategory);
}
