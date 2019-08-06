//middleware file
var Location = require("../models/location");
var Comment = require("../models/comment");
var middlewareObj = {};

//check location owner middleware
//For authorization: if user logged in and author.id === current user id, next
// one is a mongoose object the other is string use .equals() instead of ===
middlewareObj.checkLocationOwner = function(req, res, next) {
	  if (req.isAuthenticated()) {
		Location.findById(req.params.id, function (error, foundLocation) {
		  if (error) {
			res.redirect("back");
		  } else {
			if (foundLocation.author.id.equals(req.user._id)) {
			  next();
			} else {
			  res.redirect("back");
			}
		  }
		});
	  } else {
		res.redirect("back");
	  }
}

//check comment owner middleware
middlewareObj.checkCommentOwner = function(req, res, next) {
  if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function (error, foundComment) {
		  if (error) {
			res.redirect("back");
		  } else {
			// does user own the comment?
			if (foundComment.author.id.equals(req.user._id)) {
			  next();
			} else {
			  res.redirect("back");
			}
		  }
		});
	  } else {
		res.redirect("back");
	  }
}

//middleware for gatekeeping comment access to only registered and logged in users
middlewareObj.isLoggedIn = function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.redirect("/login");
}


module.exports = middlewareObj