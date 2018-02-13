const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');

const PORT = process.env.PORT || 3001;

const Routes = require('./Routes');
const AuthRoutes = require('./Routes/Auth');

const KEYS = require('./config/keys');

// This is where we store user photos (avatars).
const CLOUDINARY_URL= 'https://api.cloudinary.com/v1_1/songnapper/image/upload';


/********* CONNECT TO DATABASE *********/
mongoose.connect(KEYS.mongoURI, {useMongoClient: true});
mongoose.Promise = global.Promise;
/*  We use this form of connection when we are running mongo on our local machine
mongoose.connect('mongodb://localhost/songnapper', { useMongoClient: true });
*/




/********* SETUP EXPRESS APP *********/
const app = express();

app.use(bodyParser.json({limit:'5mb'})); 
app.use(bodyParser.urlencoded( {extended: true }));

app.use(cookieSession({
	maxAge: 30 * 24 * 60 * 60 * 1000,
	keys: [KEYS.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());


/********** CONNECT ROUTES **********/
app.use('/api', Routes); 	
app.use('/auth', AuthRoutes);

/********** HANDLING REQUESTS IN PRODUCTION **********/
if ( process.env.NODE_ENV === 'production') {
	// Make sure that express will serve up prod assets like
	// main.js and main.css (called from <script> in index.html)
	app.use(express.static('Songnapper/build'));

	// Express will serve up the index.html file if express does not 
	// recognize the route (/browse/genres/rock).
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	})
}

app.listen(PORT, () => {
	console.log(`API server listening at http://localhost${PORT}!`);
})




