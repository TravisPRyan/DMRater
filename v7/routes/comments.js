var express  = require("express");
var	router   = express.Router();
var Location = require("../models/location.js");
var Comment  = require("../models/comment.js");
//=================== Comments routes 
//NEW (comment)
router.get("/locations/:id/comments/new", isLoggedIn, function(req, res){
	//find location by id
	Location.findById(req.params.id, function(error, location){
		if(error){
			console.log(error);
		} else {
			res.render("comments/new", {location: location});
		}
	}); 
		
});

//POST (comment)
//working - uncoupled comment array and simplified naming conventions within comments/new to allign with comment schema
router.post("/locations/:id/comments", isLoggedIn, function(req, res){
   //lookup location using ID
	   Location.findById(req.params.id, function(error, location){
		   
		   	const text = req.body.text;
			const author = req.body.author;
			const commentCombo = {text: text, author: author};
		   
		   if(error){
			   console.log(error);
			   res.redirect("/locations");
		   } else {
			Comment.create(commentCombo, function(error, comment){
			   if(error){
				   console.log(error);
			   } else {
				   location.comments.push(comment);
				   location.save();
				   res.redirect('/locations/' + location._id);
			   }
				
			});
		}
	   
   });
});

//middleware for gatekeeping comment access to only registered and logged in ussers
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;