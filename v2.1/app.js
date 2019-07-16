var express  = require("express"),
    app      = express(),
    mongoose = require("mongoose");

//connect to the db
mongoose.connect("mongodb://localhost:27017/DMRater", { useNewUrlParser: true });

// mongoose depriciation warning workarounds
//read more @ https://mongoosejs.com/docs/deprecations.html
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//utilize built in body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//allow express to serve files from public folder
app.use(express.static("public"));

//Schema config
var locationSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Location = mongoose.model("Location", locationSchema);

//create syntax
// Location.create({
// 	name: "The Salty Dog", image: "https://wiki.rpg.net/images/thumb/0/0a/The_Salty_Dog.jpeg/500px-The_Salty_Dog.jpeg", description: "Local watering hole for the dockworkers union. Strangley damp, and musty interior. Good ale, but crusty patrons."
// }, function(error, location){
// 	if(error){
// 		console.log(error);
// 	} else{
// 		console.log("Location Created: ");
// 		console.log(location);
// 	}
// });

//temp array for locations. placeholder for proof of concept, will be replaced by db.
// var locations = [
// 		{name: "Location 1", image: "https://wiki.rpg.net/images/thumb/0/0a/The_Salty_Dog.jpeg/500px-The_Salty_Dog.jpeg"},
// 		{name: "Location 2", image: "https://live.staticflickr.com/1463/24701897032_37d7e99168.jpg"},
// 		{name: "location 3", image: "https://live.staticflickr.com/7539/16112290310_c51a6a4f9f.jpg"},
// 		{name: "Location 1", image: "https://wiki.rpg.net/images/thumb/0/0a/The_Salty_Dog.jpeg/500px-The_Salty_Dog.jpeg"},
// 		{name: "Location 2", image: "https://live.staticflickr.com/1463/24701897032_37d7e99168.jpg"},
// 		{name: "location 3", image: "https://live.staticflickr.com/7539/16112290310_c51a6a4f9f.jpg"}
// 	];

//HOME
//landing page route 
app.get("/", function(req, res){
	res.render("home.ejs");
});

//INDEX
//locations route - displays grid of known locations (within DMRatr db)
app.get("/locations", function(req, res){
	Location.find({}, function(error, locations){
		if(error){
			console.log(error);
		} else {
			res.render("index.ejs", {locations: locations});
		}
	});
	//res.render("locations.ejs", {locations: locations});
});

//NEW
//route to form page which captures new location info
app.get("/locations/new", function(req, res){
	res.render("new.ejs");
});

//CREATE
//retrieves new location info from form (views/new.ejs) and appends it to the db DMRater
app.post("/locations", function(req, res){
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
app.get("/locations/:id", function(req, res){
	//search db for id, and return all info
	//mongoose method findById(id, callback(err, data));
	Location.findById(req.params.id, function(error, locationDetail){
		if(error){
			console.log(error);
		} else {
			res.render("show.ejs", {location: locationDetail});
		}
	});
});




app.listen(3000, function(){
	console.log("DMRater Server listening on PORT 3000");
});