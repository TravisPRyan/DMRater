var express = require("express");
var app = express();

//utilize built in body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



//allow express to serve files from public folder
app.use(express.static("public"));

//temp array for locations. placeholder for proof of concept, will be replaced by db.
var locations = [
		{name: "Location 1", image: "https://wiki.rpg.net/images/thumb/0/0a/The_Salty_Dog.jpeg/500px-The_Salty_Dog.jpeg"},
		{name: "Location 2", image: "https://live.staticflickr.com/1463/24701897032_37d7e99168.jpg"},
		{name: "location 3", image: "https://live.staticflickr.com/7539/16112290310_c51a6a4f9f.jpg"},
		{name: "Location 1", image: "https://wiki.rpg.net/images/thumb/0/0a/The_Salty_Dog.jpeg/500px-The_Salty_Dog.jpeg"},
		{name: "Location 2", image: "https://live.staticflickr.com/1463/24701897032_37d7e99168.jpg"},
		{name: "location 3", image: "https://live.staticflickr.com/7539/16112290310_c51a6a4f9f.jpg"}
	];

//landing page route 
app.get("/", function(req, res){
	res.render("home.ejs");
});

//locations route - displays grid of known locations
app.get("/locations", function(req, res){
	
	res.render("locations.ejs", {locations: locations});
});
//route to form page which captures new location info
app.get("/locations/new", function(req, res){
	res.render("newLocationForm.ejs");
});

//retrieves new location info from form and appends it to the temp array 
app.post("/locations", function(req, res){
	//get data from form and add to array
	const location = req.body.location;
	const image = req.body.image;
	const newCombo = {name: location, image: image};
	locations.push(newCombo);
	//redirect defaults to get request
	res.redirect("/locations");
	
});


app.listen(3000, function(){
	console.log("DMRater Server listening on PORT 3000");
});