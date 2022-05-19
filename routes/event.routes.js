const router = require("express").Router();

const { default: mongoose } = require("mongoose");
const Event = require('../models/Event.model');
// const  { isAuthenticated } = require("../middleware/jwt.middleware")

//CREATE EVENT

//NEEDS ROUTE GUARD

router.post('/events', (req, res, next) => {
    const { title, date, time, description, cost, location } = req.body;

    const newEvent = {
        title, 
        // date: date
        // time, 
        description, 
        cost, 
        attendees: [],
        location
    }

    Event.create(newEvent)
        .then(response => res.status(201).json(response))
        .catch(err => {
            console.log("error creating a new project", err);
            res.status(500).json({
                message: "error creating a new project",
                error: err
            });
        })
});

// GET LIST OF EVENTS

// UNPROTECTED ROUTE

router.get("/events", (req, res, next) => {
    Event.find()
        // .populate("")
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
        // .populate('tasks')
        .then(event => res.json(event))
        .catch(err => {
            console.log("error getting details of a event", err);
            res.status(500).json({
                message: "error getting details of a event",
                error: err
            });
        })
});

// UPDATE EVENT BY ID

// NEEDS ROUTE GUARD

router.put('/events/:eventId', (req, res, next) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Event.findByIdAndUpdate(eventId, req.body, { new: true })
        .then((updatedEvent) => res.json(updatedEvent))
        .catch(err => {
            console.log("error updating event", err);
            res.status(500).json({
                message: "error updating event",
                error: err
            });
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



module.exports = router;