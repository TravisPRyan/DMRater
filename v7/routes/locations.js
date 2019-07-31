var express  = require("express");
var	router   = express.Router();
var	Location = require("../models/location.js");

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
router.get("/locations/new", function(req, res){
	res.render("locations/new.ejs");
});

//CREATE
//retrieves new location info from form (views/locations/new.ejs) and appends it to the db DMRater
router.post("/locations", function(req, res){
	const location = req.body.location;
	const image = req.body.image;
	const description = req.body.description;
	const newCombo = {name: location, image: image, description: description};
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

module.exports = router;