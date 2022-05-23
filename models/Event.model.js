const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            // required: true
        },
        // time: {
        //     type: String, // Not 100% sure will see if's there a time object?
        //     required: true
        // },
        description: {
            type: String,
            required: true
        },
        attendees: [{
            type: Schema.Types.ObjectId, 
            ref: 'User',
            unique: true
        }],
        cost: {
            type: Number,
            default: 0
        },
        location: String,
    }
  
);

const Event = model("Event", eventSchema);

module.exports = Event;
