const { Schema, model, Mongoose } = require("mongoose");

const feedModel = new Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true
        },
        cotent: {
            type: Date,
            required: true
        },
        postedBy: {
            type: Schema.User.UserId, 
            ref: 'User' 
        },
        // picture .... add later i guess
        // likes counter
        // comments
    },
    {
        timestamps: true,
    }
);

const Feed = model("Feed", feedModel);

module.exports = User;
