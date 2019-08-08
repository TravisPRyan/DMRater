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
			req.flash("error", error.message);
			return res.render("register.ejs");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to DMRater " + user.username);
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
	req.flash("success", "Logged You Out");
	res.redirect("/locations");
});



module.exports = router;