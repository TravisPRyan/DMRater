var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var	User     = require("../models/user");

//========================= Index/Auth routes
//HOME
//landing page route 
router.get("/", function(req, res){
	res.render("home.ejs");
});

//=======================
//AUTH Routes

//SHOW register form
router.get("/register", function(req, res){
	res.render("register");
});

//registration logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(error, user){
		if(error){
			console.log(error);
			return res.render("register.ejs");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/locations");
		});
	});
});

//SHOW login form 
router.get("/login", function(req, res){
	res.render("login.ejs");
});
//login logic app.post("/local, middleware(passportLocalMongoose), callback)
router.post("/login", passport.authenticate("local", 
		{
			successRedirect: "/locations",
			failreRedirect: "/login"
		}), function(req, res){
		
});

//LOGOUT route
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/locations");
});

//middleware for gatekeeping comment access to only registered and logged in ussers
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;