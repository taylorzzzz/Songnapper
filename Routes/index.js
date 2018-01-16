const routes = require('express').Router();

// const ConnectionController = require('../Controllers/submitConnection_controller');
const submit_controller = require('../Controllers/submit_controller.js');
const connection_controller = require('../Controllers/connection_controller');
const track_controller = require('../Controllers/track_controller');
const browse_controller = require('../Controllers/browse_controller');
const user_controller = require('../Controllers/user_controller');

/*
routes.get('/tracks', (req, res) => {
	console.log('received get request to /tracks');
	ConnectionController.searchSpotifyTracks(req, res);
})
*/
//************************************** SUBMIT CONNECTION PAGE 
routes.get('/submit/searchTracks', (req, res) => {
	submit_controller.searchSpotifyTracks(req, res);
})
routes.post('/submit/submitConnection2', (req, res) => {
	submit_controller.create_connection(req, res);
})


//************************************** BROWSE PAGE 
routes.get('/browse/getSubcategories', (req, res) => {				
	browse_controller.getSubcategories(req, res);
})
routes.get('/browse/getSubcategoryTracks', (req, res) => {
	browse_controller.getTracks(req, res);
})
routes.get('/browse/getSubcategoryConnections', (req, res) => {
	browse_controller.getConnections(req, res);
})


// Connection Page
routes.get('/connection/getConnection', (req, res) => {
	connection_controller.getConnection(req,res);
})
routes.get('/connection/upVote', (req, res) => {
	connection_controller.upVote(req, res);
})
routes.get('/connection/downVote', (req, res) => {
	connection_controller.downVote(req, res);
})


// Track Page 
routes.get('/track/getTrack', (req, res) => {
	track_controller.getTrack(req, res);
})


// User page 
routes.get('/user/getUserInfo', (req, res) => {
	console.log('received request to /getUserInfo');
	user_controller.getUser(req, res);
})
routes.post('/user/editUserInfo', (req, res) => {
	console.log('received request to /getUserInfo');
	user_controller.editUserInfo(req, res);
})



/*
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
*/

/* Other Stuff */
/*
routes.get('/selectedTrackConnections', (req, res) => {
	ConnectionController.selectedTrackConnections(req, res);
})
routes.get('/getTracksAndConnections', (req, res) => {
	ConnectionController.getTracksAndConnections(req, res);
})
*/

module.exports = routes;