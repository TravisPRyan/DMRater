var express  = require("express");
var	router   = express.Router();
var Location = require("../models/location.js");
var Comment  = require("../models/comment.js");
var middleware = require("../middleware/index.js");
//=================== Comments routes 
//NEW (comment)
router.get("/locations/:id/comments/new", middleware.isLoggedIn, function(req, res){
	//find location by id
	Location.findById(req.params.id, function(error, location){
		if(error){
			console.log(error);
		} else {
			res.render("comments/new", {location: location});
		}
	}); 
		
});

//CREATE (comment)
//working - uncoupled comment array and simplified naming conventions within comments/new to allign with comment schema
router.post("/locations/:id/comments", middleware.isLoggedIn, function(req, res){
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
				   req.flash("error", "Something went wrong!");  
				   console.log(error);
			   } else {
				   //add username and id to comments, then save
				   comment.author.id = req.user._id;
				   comment.author.username = req.user.username;
				   comment.save();
				   location.comments.push(comment);
				   location.save();
				   req.flash("success", "Comment Created!");  
				   res.redirect('/locations/' + location._id);
			   }
				
			});
		}
	   
   });
});

//EDIT (comment)
router.get("/locations/:id/comments/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
	Comment.findById(req.params.comment_id, function(error, foundComment){
		if(error){
			res.redirect("back");
		} else {
			res.render("comments/edit", {location_id: req.params.id, comment: foundComment });
		}
	});
});

//UPDATE (comment)
router.put("/locations/:id/comments/:comment_id", middleware.checkCommentOwner, function(req, res){
	const comment = req.body.comment;
	const newCombo = {text: comment};
   Comment.findByIdAndUpdate(req.params.comment_id, newCombo, function(error, updatedComment){
      if(error){
          res.redirect("back");
      } else {
		  req.flash("success", "Comment Updated!");
          res.redirect("/locations/" + req.params.id );
      }
   });
});

//DESTROY (comment)
router.delete("/locations/:id/comments/:comment_id", middleware.checkCommentOwner, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(error){
		if(error){
			res.redirect("back");
		} else {
			req.flash("success", "Comment Deleted!");
			res.redirect("/locations/" + req.params.id)
		}
	})
})



module.exports = router;