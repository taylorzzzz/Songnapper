var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var hash_password = function( password ) {
    let salt = bcrypt.genSaltSync(); // enter number of rounds, default: 10
    let hash = bcrypt.hashSync( password, salt );
    return hash;
};

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

// This method is used during log in to check password
UserSchema.methods.comparePassword = function(password) {
    if ( ! this.password ) { return false; }
    console.log('comparing hashed password');
   	return bcrypt.compareSync( password, this.password );
};


UserSchema.pre('save', function(next) {
	console.log('UserSchema.pre running');
    // check if password is present and is modified.
    if ( this.password && this.isModified('password') ) {
    	// save the hashed version of the user password (this.password) 
        this.password = hash_password(this.password);
    }
    next();
});

const User =  mongoose.model('User', UserSchema);

module.exports = User;