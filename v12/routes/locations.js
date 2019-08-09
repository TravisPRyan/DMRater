var express  = require("express");
var	router   = express.Router();
var	Location = require("../models/location.js");
var Comment  = require("../models/comment.js");
var middleware = require("../middleware/index.js");

//========================= Location routes
//INDEX
//locations route - displays grid of known locations (within DMRatr db)
router.get("/locations", function(req, res){
	Location.find({}, function(error, locations){
		if(error){
			console.log(error);
		} else {
			res.render("locations/index.ejs", {locations: locations, currentUser: req.user});
		}
	});
	//res.render("locations.ejs", {locations: locations});
});

//NEW
//route to form page which captures new location info
router.get("/locations/new", middleware.isLoggedIn, function(req, res){
	res.render("locations/new.ejs");
});

//CREATE
//retrieves new location info from form (views/locations/new.ejs) and appends it to the db DMRater
router.post("/locations", middleware.isLoggedIn, function(req, res){
	const location = req.body.location;
	const price = req.body.price;
	const image = req.body.image;
	const description = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	const newCombo = {name: location, price: price, image: image, description: description, author: author};
	
	Location.create(newCombo, function(error, newLoc){
		if(error){
			console.log(error);
		} else {
			console.log(newLoc);
			//redirect defaults to get request
			res.redirect("/locations");
		}
	});
});


//SHOW
//display detailed info for a location, remember order of routes matters
// will use the mongo assigned location._id's
router.get("/locations/:id", function(req, res){
	//search db for id, and return all info
	//mongoose method findById(id, callback(err, data));
	//then populate the comments array so that it doesnt only return the oibject id reference
	Location.findById(req.params.id).populate("comments").exec( function(error, locationDetail){
		if(error){
			console.log(error);
		} else {
			res.render("locations/show.ejs", {location: locationDetail});
		}
	});
});

//DESTROY
router.delete("/locations/:id", middleware.checkLocationOwner, function(req, res) {
    Location.findByIdAndRemove(req.params.id, function(error, locationRemoved) {
        if (error) {
            console.log(error);
        }
        Comment.deleteMany( {_id: { $in: locationRemoved.comments } }, function(error){
            if (error) {
                console.log(error);
            }
            res.redirect("/locations");
        });
    });
});



//EDIT
router.get("/locations/:id/edit", middleware.checkLocationOwner, function(req, res){
	Location.findById(req.params.id, function(error, foundLocation){
			res.render("locations/edit.ejs", {location: foundLocation});
	});
});

//UPDATE
//find and update the correct location, then redirect to show
router.put("/locations/:id", middleware.checkLocationOwner, function(req, res){
	const location = req.body.location;
	const price = req.body.price;
	const image = req.body.image;
	const description = req.body.description;
	const newCombo = {name: location, price: price, image: image, description: description};
	
	Location.findByIdAndUpdate(req.params.id, newCombo, function(error, updatedLoc){
		if(error){
			res.redirect("/locations");
		} else {
			res.redirect("/locations/" + req.params.id);
		}
	});
});





module.exports = router;