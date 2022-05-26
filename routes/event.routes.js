const router = require("express").Router();


const { default: mongoose } = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Event = require('../models/Event.model');
const User = require("../models/User.model")


//CREATE EVENT

router.post('/events', isAuthenticated, (req, res, next) => {

    if (!req.payload.isAdmin){
        notAdmin = new Error('notAdmin')
        notAdmin.message = 'You are not authroised to perform this action'
        res.status(401).json(notAdmin.message)
        throw notAdmin
    }

    const { name, description, from, to, cost, location, repeat, style, imageUrl} = req.body;
    const newEvent = {
        name, 
        from,
        to, 
        description, 
        cost, 
        location,
        repeat,
        style,
        imageUrl
    }
    console.log(newEvent)
    
    Event.create(newEvent)
        .then(response => res.status(201).json(response))
        .catch(err => {
            console.log("error creating a new project", err);
            res.status(500).json({
                message: "Error creating a new project, please make sure that you have filled in the name, dates and description fields",
                error: err
            });
        })
});

// GET LIST OF EVENTS

// UNPROTECTED ROUTE

router.get("/events", (req, res, next) => {
    Event.find()
        .populate("attendees")
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            console.log("error getting list of events", err);
            res.status(500).json({
                message: "error getting list of events",
                error: err
            });
        })
});

//  GET DETAILS FOR ONE EVENT


// UNPROTECTED ROUTE

router.get('/events/:eventId', (req, res, next) => {
    
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Event.findById(eventId)
        .populate('attendees')
        .then(event => res.json(event))
        .catch(err => {
            console.log("error getting details of a event", err);
            res.status(500).json({
                message: "error getting details of a event",
                error: err
            });
        })
});

// UPDATE EVENT ATTENDEES BY ID AND PUSHING

// NEEDS ROUTE GUARD

router.put('/events/:eventId/pushAttendee', (req, res, next) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    console.log(req.body)

    Event.findByIdAndUpdate(eventId, { $push: { attendees: req.body.id } }, { new: true })
        .then((updatedEvent) => 
            User.findByIdAndUpdate(req.body.id, { $push: {eventsAttending: eventId}}, {new: true})
            .then((updatedUser) => res.json(updatedUser))
                .catch(err => {
                    console.log("error updating user", err);
                    res.status(500).json({
                        message: "error updating user",
                        error: err
                    })
                })
        )
})
    

// UPDATE EVENT ATTENDEES BY ID AND PUSHING

router.put('/events/:eventId/pullAttendee', (req, res, next) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    console.log(req.body)

    Event.findByIdAndUpdate(eventId, { $pull: { attendees: req.body.id } }, { new: true })
        .then((updatedEvent) => {
            User.findByIdAndUpdate(req.body.id, { $pull: {eventsAttending: eventId}}, {new: true})
                .then( response => {
                    res.json(response)
                })
                .catch(err => {
                    console.log("error updating event", err);
                    res.status(500).json({
                        message: "error updating event",
                        error: err
                    });
                })
        }) 
});

// DELETE AN EVENT

// NEEDS ROUTE GUARD

router.delete('/events/:eventId', (req, res, next) => {


    
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Event.findByIdAndRemove(eventId)
        // .then(deletedEvent => {
        //     return Task.deleteMany({ _id: { $in: eventId.tasks } });
        // }) ALLOWS US TO DELETE EVENT FROM ATTENDEES EVENT ARRAY
        .then((response) => {
            console.log(response)
            res.json({
                message: `The event: ${response.title} was removed successfully.` })})
        .catch(err => {
            console.log("error deleting event", err);
            res.status(500).json({
                message: "error deleting event",
                error: err
            });
        })
});

router.put('/events/pushScheduler', (req, res, next) =>{
    // const { eventId } = req.body;

    Scheduler.findByIdAndUpdate("628bac80a2ad8420fda0bd60",
        { $push: { events: req.body } },  { new: true })
    .then((updatedEvent) => res.json(updatedEvent))
    .catch(err => {
        console.log("error updating event", err);
        res.status(500).json({
            message: "error updating event",
            error: err
        });
    })
})

router.get("/events/scheduler", (req, res, next) => {
    Scheduler.find()
        .populate("events")
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            console.log("error getting list of events", err);
            res.status(500).json({
                message: "error getting list of events",
                error: err
            });
        })
});

module.exports = router;