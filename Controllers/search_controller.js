const mongoose = require('mongoose');

const Connection2 = require('../Models/Connection2');

exports.search = (req, res) => {
	const searchStr = req.query.string;
	const page = req.query.page;

	const perPage = 10;
	// This statement creates a mongoose query that uses regular expressions 
	// so that any track, artist or album that contains the string 
	// (doesn't have to match exactly) is returned.
	const regExQuery = {
		$or : [
			{ 'tracks.title': new RegExp(searchStr, 'i') },
			{ 'tracks.artist.name': new RegExp(searchStr, 'i') },
			{ 'tracks.album.name': new RegExp(searchStr, 'i') },
		]
	}

	Connection2.find(regExQuery)
		.limit(perPage).skip(page * perPage)
		.then(c => {
			Connection2.count(regExQuery)
				.then(count => {
					return res.json({results: c, count: count});
				})	
		})
		.catch(err => {
			console.log('err');
			return res.json(err);
		})
	// So we want to "search" our connections for any tracks 
	// that match the query string.
}