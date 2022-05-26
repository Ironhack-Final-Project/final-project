const express = require("express");
const User = require("../models/User.model");
const router = express.Router();

//Add Dog
router.put('/user/:userId/add-dog', (req, res, next) => {

    if (req.body.name === '' || req.body.breed === ''){
        let newError = new Error()
        newError.message = "Please provide a name and breed"
       
        res.status(500).json(newError.message)
        throw newError
    }
    console.log(req.body)
    let newDog = {
        name: req.body.name,
        breed: req.body.breed,
        imageUrl: req.body.imageUrl
    }

    if (newDog.imageUrl === '') {
        newDog = {
            name: req.body.name,
            breed: req.body.breed,
        }
    }



    User.findByIdAndUpdate(req.params.userId, { $push: { dogs: newDog } })
        .populate("dogs")
        .then((response) => {
            res.json(response)
        })
        .catch()
})


// get user details
router.get('/user/:userId', (req, res, next) => {
    User.findById(req.params.userId)
        .populate("dogs")
        .populate('eventsAttending')
        .then(response => {
            const {dogs, eventsAttending} = response

            const newResponse = {dogs, eventsAttending}
            console.log('new', newResponse)

            res.json(newResponse)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error getting dogs',
                error: err
            })
        })
})

// delete dog
router.get('/user/:userId/delete-dog', (req, res, next) => {
    User.findById(req.params.userId)
        .populate("dogs")
        .populate('eventsAttending')
        .then(response => { 
            const {eventsAttending, dogs} = response
            const newResponse = { eventsAttending, dogs}
            console.log("delete response:....", newResponse)
            res.json(newResponse) })
        .catch(err => {
            res.status(500).json({
                message: 'error deleting dog',
                error: err
            })
        })
})

// change user details
router.put('/user/:userId', (req, res, next) => {
    const {eventsAttending, dogs} = req.body
    console.log(eventsAttending)
    console.log(dogs)
    User.findByIdAndUpdate(req.params.userId, {eventsAttending, dogs})
        .then(response => {
            console.log("response....", response)
            const { eventsAttending, dogs } = response
            const eventsAndDogs = { eventsAttending, dogs }
            res.json(eventsAndDogs)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: 'error deleting dog',
                error: err
            })
        })
})


module.exports = router;