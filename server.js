const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const Routes = require('./Routes');

/********* CONNECT TO DATABASE *********/
mongoose.connect('mongodb://localhost/songnapper', { useMongoClient: true });
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://tww:Wodash91!@ds257485.mlab.com:57485/songnapper_test', {useMongoClient: true});
/********* SETUP EXPRESS APP *********/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true }));
app.use('/api', Routes); 	// Connect the api route endpoints to the app

app.listen(port, () => {
	console.log(`API server listening at http://localhost${port}!`);
})