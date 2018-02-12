// keys.js - Do commit. Our Heroku project will need to be 
// able to access this file.

// When we are running the back end on Heroku, the 
// NODE_ENV variable is automatically set to production.
if (process.env.NODE_ENV === 'production') {
	// we are in production
	module.exports = require('./prod');
} else {
	// If we are running back end server from local machine
	// then NODE_ENV is probably not defined.
	// In this case we want to export the dev keys - the 
	// keys for the dev version of our db and the keys for 
	// the dev version of our Google Auth application.
	module.exports = require('./dev');
}