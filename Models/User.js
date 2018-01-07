var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	google_ID: String, 
	username: String,
	password: String,
	email: String,
	friends: [ Schema.Types.ObjectId ],
	submitted_connections: [ 
		{
			type: Schema.Types.ObjectId, 
			ref: 'Connection2'
		}],
})

const User =  mongoose.model('User', UserSchema);

module.exports = User;