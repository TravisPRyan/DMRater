var mongoose = require("mongoose");

//location Schema config
var locationSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }]
});


module.exports = mongoose.model("Location", locationSchema); 