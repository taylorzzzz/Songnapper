const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');

const port = process.env.PORT || 3001;
const Routes = require('./Routes');
const AuthRoutes = require('./Routes/Auth');
const KEYS = require('./keys.json');

/********* CONNECT TO DATABASE *********/
mongoose.connect('mongodb://localhost/songnapper', { useMongoClient: true });
mongoose.Promise = global.Promise;


/********* SETUP EXPRESS APP *********/
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true }));
// Set up express to be able to use cookie sessions
app.use(cookieSession({
	maxAge: 30 * 24 * 60 * 60 * 1000,
	keys: [KEYS.cookieKey]
}));

// set up express to be able to use passport
app.use(passport.initialize());
app.use(passport.session());



app.use('/api', Routes); 	// Connect the api route endpoints to the app
app.use('/auth', AuthRoutes);

app.listen(port, () => {
	console.log(`API server listening at http://localhost${port}!`);
})