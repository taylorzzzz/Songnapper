var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	_id: Schema.Types.ObjectId,
	username: String,
	password: String,
	email: String,
	friends: [ Schema.Types.ObjectId ],
})

var User =  mongoose.model('User', UserSchema);
module.exports = User;