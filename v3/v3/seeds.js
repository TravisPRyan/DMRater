var mongoose = require("mongoose"),
	Location = require("./models/location.js"),
	Comment  = require("./models/comment");

var data = [
    {
        name: "The Salty Dog", 
        image: "https://wiki.rpg.net/images/thumb/0/0a/The_Salty_Dog.jpeg/500px-The_Salty_Dog.jpeg",
        description: "The Saltiest"
    },
    {
        name: "Pandemonium", 
        image: "https://live.staticflickr.com/1463/24701897032_37d7e99168.jpg",
        description: "Absolute Madness"
    },
    {
        name: "The Sorecerer's Inn", 
        image: "https://live.staticflickr.com/7539/16112290310_c51a6a4f9f.jpg",
        description: "Dank as a moldy tome"
    }
];





function seedDB(){
   //Remove all Locations
   Location.deleteMany({}, function(error){
        if(error){
            console.log(error);
        }
        console.log("removed Locations!");
        Comment.remove({}, function(error) {
            if(error){
                console.log(error);
            }
            console.log("removed comments!");
             //add a few Locations
            data.forEach(function(seed){
                Location.create(seed, function(error, Location){
                    if(error){
                        console.log(error);
                    } else {
                        console.log("added a Location");
                        //create a comment
                        Comment.create(
                            {
                                text: "I was told there would be cake, which did not occur",
                                author: "Gladys"
                            }, function(error, comment){
                                if(error){
                                    console.log(error);
                                } else {
                                    Location.comments.push(comment);
                                    Location.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;