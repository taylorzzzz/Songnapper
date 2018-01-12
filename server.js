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
app.use(cookieSession({
	maxAge: 30 * 24 * 60 * 60 * 1000,
	keys: [KEYS.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());




/********** CONNECT ROUTES **********/
app.use('/api', Routes); 	
app.use('/auth', AuthRoutes);





app.listen(port, () => {
	console.log(`API server listening at http://localhost${port}!`);
})





