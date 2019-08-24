var mongoose = require("mongoose");
//review schema config
var reviewSchema = new mongoose.Schema({
    rating: {
        // rating of type number
        type: Number,
        // required rating and params
        required: "Please provide a rating (1-5 stars).",
        // min /max
        min: 1,
        max: 5,
        // if entry is integer - validate
        validate: {
            
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value."
        }
    },
    // review body
    text: {
        type: String
    },
    
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    }
}, {
    // if timestamps are set to true mongoose assigns createdAt and updatedAt fields of type date to the schema.
    timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);