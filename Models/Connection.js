var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var ConnectionSchema = new Schema({
	trackOne_id: Schema.Types.ObjectId,
	trackTwo_id: Schema.Types.ObjectId,
	
	
})

var Connection = mongoose.model('Connection', ConnectionSchema);
module.exports = Connection;