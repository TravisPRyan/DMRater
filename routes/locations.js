var express    = require("express");
var router     = express.Router();
var Location = require("../models/location");
var Comment    = require("../models/comment");
var Review     = require("../models/review");
var middleware = require("../middleware");


//========================= Location routes
//INDEX
//locations route - displays grid of known locations (within DMRatr db)
router.get("/", function (req, res) {
    // Get all locations from DB
    Location.find({}, function (error, allLocations) {
        if (error) {
            console.log(error);
        } else {
            res.render("locations/index", {locations: allLocations, page: 'locations'});
        }
    });
});

//NEW
//route to form page which captures new location info
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("locations/new");
});

//CREATE
//retrieves new location info from form (views/locations/new.ejs) and appends it to the db DMRater
router.post("/", middleware.isLoggedIn, function (req, res) {
    // get data from form and add to locations array
    var name = req.body.name;
	var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newLocation = {name: name, price: price, image: image, description: desc, author: author}
    // Create a new location and save to DB
    Location.create(newLocation, function (error, newlyCreated) {
        if (error) {
            console.log(error);
        } else {
            //redirect back to locations page
            res.redirect("/locations");
        }
    });
});



//SHOW
//display detailed info for a location, remember order of routes matters
// will use the mongo assigned location._id's
router.get("/:id", function (req, res) {
    //search db for id, and return all info
	//mongoose method findById(id, callback(err, data));
	//then populate the comments array so that it doesnt only return the oibject id reference
    Location.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (error, foundLocation) {
        if (error) {
            console.log(error);
        } else {
            //render show template with that location
            res.render("locations/show", {location: foundLocation});
        }
    });
});

// EDIT Location ROUTE
router.get("/:id/edit", middleware.checkLocationOwnership, function (req, res) {
    Location.findById(req.params.id, function (error, foundLocation) {
        res.render("locations/edit", {location: foundLocation});
    });
});

// UPDATE Location ROUTE
router.put("/:id", middleware.checkLocationOwnership, function (req, res) {
    delete req.body.location.rating;
    // find and update the correct location
    Location.findByIdAndUpdate(req.params.id, req.body.location, function (error, updatedLocation) {
        if (error) {
            res.redirect("/locations");
        } else {
            //redirect (show page)
            res.redirect("/locations/" + req.params.id);
        }
    });
});

// DESTROY Location ROUTE
router.delete("/:id", middleware.checkLocationOwnership, function (req, res) {
    Location.findById(req.params.id, function (error, location) {
        if (error) {
            res.redirect("/locations");
        } else {
            // deletes all comments within location
            Comment.deleteMany({"_id": {$in: location.comments}}, function (error) {
                if (error) {
                    console.log(error);
                    return res.redirect("/locations");
                }
                // deletes all reviews within location
                Review.deleteMany({"_id": {$in: location.reviews}}, function (error) {
                    if (error) {
                        console.log(error);
                        return res.redirect("/locations");
                    }
                    //  delete the location
                    location.deleteOne();
                    req.flash("success", "Venue successfully deleted.");
                    res.redirect("/locations");
                });
            });
        }
    });
});

module.exports = router;