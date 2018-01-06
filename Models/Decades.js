const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DecadesSchema = new Schema({
	value: String,
	count: Number,
	image: String
})

const Decades = mongoose.model('Decades', DecadesSchema);

module.exports = Decades;