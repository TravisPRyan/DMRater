var express = require("express");
var router  = express.Router({mergeParams: true});
var Location = require("../models/location");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//=================== Comments routes 
//NEW (comment)
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find location by id
    console.log(req.params.id);
    Location.findById(req.params.id, function(error, location){
        if(error){
            console.log(error);
        } else {
             res.render("comments/new", {location: location});
        }
    })
});

//CREATE (comment)
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup location using ID
   Location.findById(req.params.id, function(error, location){
       if(error){
           console.log(error);
           res.redirect("/locations");
       } else {
        Comment.create(req.body.comment, function(error, comment){
           if(error){
               req.flash("error", "Oops, there was an error.");
               console.log(error);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               location.comments.push(comment);
               location.save();
               console.log(comment);
               req.flash("success", "Comment successfully added.");
               res.redirect('/locations/' + location._id);
           }
        });
       }
   });
});

//EDIT (comment)
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(error, foundComment){
      if(error){
          res.redirect("back");
      } else {
        res.render("comments/edit", {location_id: req.params.id, comment: foundComment});
      }
   });
});

//UPDATE (comment)
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
      if(error){
          res.redirect("back");
      } else {
          res.redirect("/locations/" + req.params.id );
      }
   });
});

//DESTROY (comment)
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
       if(error){
           res.redirect("back");
       } else {
           req.flash("success", "Comment successfully deleted.");
           res.redirect("/locations/" + req.params.id);
       }
    });
});

module.exports = router;