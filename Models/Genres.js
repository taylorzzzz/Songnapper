const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenresSchema = new Schema({
	value: String,
	count: Number,
	image: String
})

const Genres = mongoose.model('Genres', GenresSchema);

module.exports = Genres;