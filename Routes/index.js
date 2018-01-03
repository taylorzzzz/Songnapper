const routes = require('express').Router();
var ConnectionController = require('../Controllers/submitConnection_controller');
var submit_controller = require('../Controllers/submit_controller.js');
var connection_controller = require('../Controllers/connection_controller');
var track_controller = require('../Controllers/track_controller');

routes.get('/tracks', (req, res) => {
	ConnectionController.searchSpotifyTracks(req, res);
})
routes.get('/searchTracks', (req, res) => {
	console.log('recieved request to /searchTracks');
	submit_controller.searchSpotifyTracks(req, res);
})
/*
routes.post('/submitConnection', (req, res) => {
	ConnectionController.create_connection(req, res);
})
*/
routes.post('/submitConnection2', (req, res) => {
	console.log('recieved request to /submitConnection2');
	submit_controller.create_connection(req, res);
})

/* get Tracks that match the category and subcategory which are passed as query params*/
routes.get('/getTracks', (req, res) => {
	console.log('recieved request to /getTracks');
	ConnectionController.getTracks(req, res);
})
routes.get('/getConnections', (req, res) => {
	console.log('recieved request to /getConnections');
	ConnectionController.getConnections(req, res);
})
routes.get('/getConnections2', (req, res) => {
	console.log('recieved request to /getConnections2');
	ConnectionController.getConnections2(req, res);
})

/* Other Stuff */
routes.get('/selectedTrackConnections', (req, res) => {
	ConnectionController.selectedTrackConnections(req, res);
})

routes.get('/getTracksAndConnections', (req, res) => {
	ConnectionController.getTracksAndConnections(req, res);
})

// Connection Page
routes.get('/getConnection', (req, res) => {
	console.log('recieved request to /getConnection');
	connection_controller.getConnection(req,res);
})
routes.get('/upVote', (req, res) => {
	console.log('recieved request to /upVote route');
	connection_controller.upVote(req, res);
})
routes.get('/downVote', (req, res) => {
	console.log('recieved request to /downVote route');
	connection_controller.downVote(req, res);
})

// Track Page 

routes.get('/getTrack', (req, res) => {
	console.log('recieved request to /gettrack');
	track_controller.getTrack(req, res);
})

module.exports = routes;