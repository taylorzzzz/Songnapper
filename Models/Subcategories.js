const mongoose = require('mongoose');

const Schema = mongoose.Schema

SubcategorySchema = new Schema({
	genres: [{
		name: String,		// the name of the genre ie. trap, funk
		count: Number, 		// the number of tracks containing that genre
		link_img: String, 	// a link to the image to be used for the link on browse page
	}],
	decades: [{
		name: String,		
		count: Number, 		
		link_img: String,
	}],
	types: [{
		name: String,
		count: Number,
		link_img: String,
	}]
});

const Subcategories = mongoose.model('Subcategories', SubcategorySchema);

module.exports = Subcategories;