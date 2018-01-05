const mongoose = require('mongoose');
 
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
	name: String, 
	spotify_id: String,
	cover_img: String,
	release_type: String,
	release_date: String,
})

const ArtistSchema = new Schema({
	name: String,
	spotify_id: String,
	genres: [ String ]
})

const TrackSchema = new Schema({
	spotify_id: String,
	title: String,
	album: {
		type: AlbumSchema
	}, 
	artist: { 
		type: ArtistSchema 
	},
	tropes: [ String ],
})

const CommentSchema = new Schema({
	content: String,
	author: {type: Schema.Types.ObjectId, ref: 'User'},
	posted_at: {type: Date, default: Date.now},
	likes: Number,
})


const ConnectionSchema = {
	tracks: [{
		type: TrackSchema,
	}],
	rating_ratio: {
		type: Number,
		default: 0
	},
	up_votes: {
		type: Number,
		default: 0
	},
	down_votes: {
		type: Number,
		default: 0
	},
	comments: [{
		type: CommentSchema,
	}],
	submitted_by: {
		type: Schema.Types.ObjectId, ref: 'User'
	}
}








const Connection2 = mongoose.model('Connection2', ConnectionSchema);

module.exports = Connection2;