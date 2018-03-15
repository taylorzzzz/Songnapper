const routes = require('express').Router();

const submit_controller = require('../Controllers/submit_controller.js');
const connection_controller = require('../Controllers/connection_controller');
const track_controller = require('../Controllers/track_controller');
const browse_controller = require('../Controllers/browse_controller');
const user_controller = require('../Controllers/user_controller');
const search_controller = require('../Controllers/search_controller');
const home_controller = require('../Controllers/home_controller');

//************************************** SUBMIT CONNECTION PAGE 
routes.post('/submit/searchTracks', (req, res) => {
	submit_controller.searchSpotifyTracks(req, res);
})
routes.post('/submit/submitConnection2', (req, res) => {
	submit_controller.create_connection(req, res);
})

//************************************** BROWSE PAGE 
routes.get('/browse/getSubcategories', (req, res) => {		
	console.log('--------------/getSubcategories');		
	browse_controller.getSubcategories(req, res);
})
routes.get('/browse/getSubcategoryTracks', (req, res) => {
	console.log('--------------------/browse/getSubcategoryTracks');
	browse_controller.getTracks(req, res);
})
routes.get('/browse/getSubcategoryConnections', (req, res) => {
	browse_controller.getConnections(req, res);
})
routes.get('/browse/getLatest', (req, res) => {
	browse_controller.getLatest(req, res);
})
routes.get('/browse/getTopRated', (req, res) => {
	browse_controller.getTopRated(req, res);
})


// Connection Page
routes.get('/connection/getConnection', (req, res) => {
	connection_controller.getConnection(req,res);
})
routes.get('/connection/vote', (req, res) => {
	connection_controller.vote(req, res);
})
routes.post('/connection/vote', (req, res) => {
	connection_controller.vote2(req, res);
})
routes.post('/connection/submitComment', (req, res) => {
	connection_controller.submitComment(req, res);
})
routes.post('/connection/getComments', (req, res) => {
	connection_controller.getComments(req, res);
})

// Track Page 
routes.get('/track/getTrack', (req, res) => {
	track_controller.getTrack(req, res);
})


// User page 
routes.get('/user/getUserInfo', (req, res) => {
	user_controller.getUser(req, res);
})
routes.post('/user/editUserInfo', (req, res) => {
	user_controller.editUserInfo(req, res);
})

// Search Page 
routes.get('/search', (req, res) => {
	search_controller.search(req, res);
})

// Home Page 
routes.get('/home/getFeatured', (req, res) => {
	home_controller.getFeatured(req, res);
})
routes.get('/home/getLatest', (req, res) => {
	home_controller.getLatest(req, res);
})
module.exports = routes;