const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const AlbumSchema = new Schema({
	name: String, 
	spotify_id: String,
	cover_img: String,
	release_type: String,
	release_date: Date,
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

const ConnectionSchema = {
	tracks: [{
		type: TrackSchema,
	}],
	rating_ratio: {
		type: Number,
		default: 0
	},
	weighted_rating_ratio: {
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
	submission_statement: String,
	types: [{
		type: String,
		enum: ["Melody", "Bassline", "Lyrics", "Chords", "Other"],
	}],
	comments: [{
		type: Schema.Types.ObjectId, 
		ref: 'Comment',
	}],
	submitted_by: {
		type: Schema.Types.ObjectId, 
		ref: 'User',
	},
	submitted_on: {
		type: Date,
		default: Date.now
	}
}



const Connection2 = mongoose.model('Connection2', ConnectionSchema);

module.exports = Connection2;