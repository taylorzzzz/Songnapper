var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	google_ID: String, 
	first_name: String,
	last_name: String,
	display_name: String,

	username: String,
	password: String,
	email: String,
	
	avatar: String,
	bio: String,
	birth_date: Date,

	connection_up_votes: [ 
		{
			type: Schema.Types.ObjectId, 
			ref: 'Connection2'
		}],
	connection_down_votes: [ 
		{
			type: Schema.Types.ObjectId, 
			ref: 'Connection2'
		}],

	joined_on: {
		type: Date,
		default: Date.now
	},
	friends: [ Schema.Types.ObjectId ],
	submitted_connections: [ {
		type: Schema.Types.ObjectId, 
		ref: 'Connection2'
	}],
	comments: [{
		type: Schema.Types.ObjectId, 
		ref: 'Comment'
	}]
})

const User =  mongoose.model('User', UserSchema);

module.exports = User;