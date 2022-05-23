const { Schema, model, Mongoose } = require("mongoose");

const feedModel = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        postedBy: {
            type: Schema.Types.ObjectId,
             ref: 'User',
             required: true
        },
        event: {
            type: Schema.Types.ObjectId,
             ref: 'Event',
        },
        time: { 
            type : Date, 
            default: Date.now 
        },
        imageUrl: {
            type: String,
        }
        // picture .... add later i guess
        // likes counter
        // comments
    },
);

const Feed = model("Feed", feedModel);

module.exports = Feed;
