var express  	   = require("express"),
    app      	   = express(),
    mongoose 	   = require("mongoose"),
	Location 	   = require("./models/location.js"),
	Comment  	   = require("./models/comment.js"),
	flash          = require("connect-flash"),
	passport 	   = require("passport"),
	LocalStrategy  = require("passport-local"),
	User		   = require("./models/user.js"),
	methodOverride = require("method-override"),
	seedDB   	   = require("./seeds.js");

//routes requirements
var commentRoutes  = require("./routes/comments.js"),
	locationRoutes = require("./routes/locations.js"),
	indexRoutes    = require("./routes/index.js");



//connect to the db
mongoose.connect("mongodb://localhost:27017/DMRater_v12", { useNewUrlParser: true });

app.set("view engine", "ejs");
//allows put requests when config'd
app.use(methodOverride("_method"));
//allow express to serve files from public folder
app.use(express.static(__dirname + "/public"));
//connect flash for stylized error/success reporting
app.use(flash());

//remove all locations from DB and populate from seed - see seeds.js
//seedDB();


// mongoose depriciation warning workarounds
//read more @ https://mongoosejs.com/docs/deprecations.html
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//utilize built in body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



//passport config
app.use(require("express-session")({
	secret: "secret",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware that distributes currentUser and errorSuccess info across routes 
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//linking router
app.use(commentRoutes);
app.use(locationRoutes);
app.use(indexRoutes);


app.listen(3000, function(){
	console.log("DMRater Server listening on PORT 3000");
});