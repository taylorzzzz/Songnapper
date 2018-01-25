const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypesSchema = new Schema({
	value: String,
	count: Number,
	image: String
})

const Types = mongoose.model('Types', TypesSchema);

module.exports = Types;