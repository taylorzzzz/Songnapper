var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CommentSubmitterSchema = new Schema({
	userID: {
		type: Schema.Types.ObjectId, 
		ref: 'User'
	} ,
	username: String,
	avatar: String,
});

const CommentSchema = new Schema({
	content: String,
	author: {
		type: CommentSubmitterSchema,
	},
	posted_at: {
		type: Date,
		default: Date.now
	},
	likes: Number,
});

const Comment =  mongoose.model('Comment', CommentSchema);

module.exports = Comment;