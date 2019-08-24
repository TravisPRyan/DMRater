var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//========================= Index/Auth routes
//HOME
//landing page route 
router.get("/", function(req, res){
    res.render("landing");
});

//SHOW register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//Registration logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to DMR8T|| " + user.username);
           res.redirect("/locations"); 
        });
    });
});

//SHOW login form 
router.get("/login", function(req, res){
   res.render("login", {page: "login"}); 
});

//login logic app.post("/local, middleware(passportLocalMongoose), callback)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/locations",
        failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged out.");
   res.redirect("/locations");
});



module.exports = router;