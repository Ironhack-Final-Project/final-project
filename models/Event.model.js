const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date, 
            required: true
        },
        description: {
            type: String,
            required: true
        },
        attendees: [{
            type: Schema.Types.ObjectId, 
            ref: 'User',
        }],
        cost: {
            type: Number,
            default: 0
        },
        imageUrl: String,
        location: String,
        calendar: {enabled:{
            type: Boolean,
            default: true
        }},
        enabled: {
            type: Boolean,
            default: true
        },
        is_current:{
            type: Boolean,
            default: false
        },
        repeat:{
            type: Number,
            enum: [0, 1, 2, 3, 4],
            default: 0
        }
    }
  
);

const Event = model("Event", eventSchema);

module.exports = Event;
