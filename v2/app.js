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
	image: String
});

var Location = mongoose.model("Location", locationSchema);

//create syntax
// Location.create({
// 	name: "Location 1", image: "https://wiki.rpg.net/images/thumb/0/0a/The_Salty_Dog.jpeg/500px-The_Salty_Dog.jpeg"
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

//landing page route 
app.get("/", function(req, res){
	res.render("home.ejs");
});

//locations route - displays grid of known locations (within DMRatr db)
app.get("/locations", function(req, res){
	Location.find({}, function(error, locations){
		if(error){
			console.log(error);
		} else {
			res.render("locations.ejs", {locations: locations});
		}
	});
	//res.render("locations.ejs", {locations: locations});
});

//route to form page which captures new location info
app.get("/locations/new", function(req, res){
	res.render("newLocationForm.ejs");
});

//retrieves new location info from form (views/newLocationForm.ejs) and appends it to the db DMRater
app.post("/locations", function(req, res){
	const location = req.body.location;
	const image = req.body.image;
	const newCombo = {name: location, image: image};
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


app.listen(3000, function(){
	console.log("DMRater Server listening on PORT 3000");
});