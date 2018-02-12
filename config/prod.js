// prod.js - Do commit! We need to make sure our project on Heroku 
// has access to this.
module.exports = 
	{
		"googleClientID": process.env.GOOGLE_CLIENT_ID,
		"googleClientSecret": process.env.GOOGLE_CLIENT_SECRET,
		"cookieKey": process.env.COOKIE_KEY,
		mongoURI: process.env.MONGO_URI,
	}