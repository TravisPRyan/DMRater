var mongoose = require("mongoose"),
	Location = require("./models/location.js"),
	Comment  = require("./models/comment");

var data = [
    {
        name: "The Salty Dog", 
        image: "https://wiki.rpg.net/images/thumb/0/0a/The_Salty_Dog.jpeg/500px-The_Salty_Dog.jpeg",
        description: "The Saltiest: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		author:{
            id : "588c2e092403d111454fff76",
            username: "Jim"
        }
    },
    {
        name: "Pandemonium", 
        image: "https://live.staticflickr.com/1463/24701897032_37d7e99168.jpg",
        description: "Absolute Madness:  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vel turpis nunc eget lorem. Sed odio morbi quis commodo odio aenean sed adipiscing diam. Eu mi bibendum neque egestas congue quisque egestas diam in. Vitae tortor condimentum lacinia quis vel eros donec ac odio. Congue quisque egestas diam in arcu cursus euismod quis. Bibendum at varius vel pharetra vel. Maecenas volutpat blandit aliquam etiam. Turpis massa sed elementum tempus egestas. Ante in nibh mauris cursus. Purus sit amet volutpat consequat mauris nunc congue nisi. Sed felis eget velit aliquet sagittis.",
		author:{
            id : "588c2e092403d111454fff71",
            username: "Polly"
        }
    },
    {
        name: "The Sorecerer's Inn", 
        image: "https://live.staticflickr.com/7539/16112290310_c51a6a4f9f.jpg",
        description: "Dank as a moldy tome:  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam sit amet nisl suscipit adipiscing bibendum est ultricies integer. Velit dignissim sodales ut eu sem integer vitae justo. Commodo odio aenean sed adipiscing diam donec adipiscing. Amet est placerat in egestas. Magnis dis parturient montes nascetur ridiculus mus mauris. Tincidunt id aliquet risus feugiat. Aliquet sagittis id consectetur purus. Ut placerat orci nulla pellentesque dignissim enim sit amet. Arcu non odio euismod lacinia at quis risus sed. Duis ultricies lacus sed turpis.",
		author:{
            id : "588c2e092403d111454fff77",
            username: "Janet"
        }
    }
];





function seedDB(){
   //Remove all locations
   Location.deleteMany({}, function(error){
        if (error){
            console.log(error);
        }
        console.log("removed locations!");
        Comment.deleteMany({}, function(error) {
            if (error){
                console.log(error);
            }
            console.log("removed comments!");
            //add a few locations
            data.forEach(function(seed){
                Location.create(seed, function(error, location){
                    if(error){
                        console.log(error);
                    } else {
                        console.log("added a location");
                        //create a comment
                        Comment.create(
                            {
                                text: "Smells like a crusty bus station",
                                author:{
                                    id : "588c2e092403d111454fff76",
                                    username: "Patrick"
                                }
                            }, function(error, comment){
                                if(error){
                                    console.log(error);
                                } else {
                                    location.comments.push(comment);
                                    location.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    
}

module.exports = seedDB;
