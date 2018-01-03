var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrackSchema = Schema({
	//_id: Schema.Types.ObjectId,
	spotifyId: String,
	title: String,
	album: String, 
	albumCover: String,
	artist: String,
	genres: [ String ],
	tropes: [ String ],
	connections: [ {type: Schema.Types.ObjectId, ref: 'Connection'} ]
})
var Track = mongoose.model('Track', TrackSchema);

module.exports = Track;