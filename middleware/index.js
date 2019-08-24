//middlewar file
const Location = require("../models/location.js");
const Comment    = require("../models/comment.js");
const Review     = require("../models/review.js");


const middlewareObj = {};

//check location owner middleware
//For authorization: if user logged in and author.id === current user id, next
// one is a mongoose object the other is string use .equals() instead of ===
middlewareObj.checkLocationOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Location.findById(req.params.id, function(error, foundLocation){
           if(error || !foundLocation){
               req.flash("error", "Location not found");
               res.redirect("back");
           }  else {
               // does user own the location?
            if(foundLocation.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};
//check comment owner middleware
middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(error, foundComment){
           if(error || !foundComment){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(error, foundReview){
            if(error || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Location.findById(req.params.id).populate("reviews").exec(function (error, foundLocation) {
            if (error || !foundLocation) {
                req.flash("error", "Location not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundLocation.reviews
                const foundUserReview = foundLocation.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/locations/" + foundLocation._id);
                }
                // if the review was not found, next
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};
//middleware for gatekeeping comment access to only registered and logged in users
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;