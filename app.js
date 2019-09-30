var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Location       = require("./models/location"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    reviewRoutes     = require("./routes/reviews"),
    locationRoutes   = require("./routes/locations"),
    indexRoutes      = require("./routes/index")

//local connection
// mongoose.connect("mongodb://localhost:27017/DMRaterProd", { useNewUrlParser: true });


mongoose.connect("mongodb+srv://GT78:bobcat@cluster0-h3qmh.mongodb.net/DMRater?retryWrites=true&w=majority", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// mongoose depriciation warning workarounds
//read more @ https://mongoosejs.com/docs/deprecations.html
mongoose.set('useFindAndModify', false);

// PASSPORT CONFIGURATION
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

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/locations", locationRoutes);
app.use("/locations/:id/comments", commentRoutes);
app.use("/locations/:id/reviews", reviewRoutes);


// app.listen(process.env.PORT, process.env.IP, function(){
//    console.log("The YelpCamp Server Has Started!");
// });

app.listen(3000, function(){
	console.log("DMRater v14 Server listening on PORT 3000");
});