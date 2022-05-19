const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true
        },
        date: {
            type: Date,
            // required: true
        },
        time: {
            type: String, // Not 100% sure will see if's there a time object?
            // required: true
        },
        description: String,
        attendees: Array,
        cost: Number,
        location: String,
    },
    {
        timestamps: true,
    }
);

const Event = model("Event", eventSchema);

module.exports = Event;
