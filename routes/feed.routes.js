const router = require("express").Router();

const { default: mongoose } = require("mongoose");
const Feed = require('../models/Feed.model');
const fileUploader = require("../config/cloudinary.config")

// const  { isAuthenticated } = require("../middleware/jwt.middleware")

//CREATE POSTS

//NEEDS ROUTE GUARD
router.post('/feed', (req, res, next) => {
    const { title, content, postedBy, imageUrl, event} = req.body;
    console.log(imageUrl)
    const newPost = {
        title, 
        content, 
        postedBy,
        imageUrl,
        event
    }

    if (newPost.event === ''){
        delete newPost.event
    }

    if (newPost.imageUrl === ''){
        delete newPost.imageUrl
    }
    console.log(newPost)

    Feed.create(newPost)
        .then(response => res.status(201).json(response))
        .catch(err => {
            console.log("error creating a new post", err);
            res.status(500).json({
                message: "error creating a new post",
                error: err
            });
        })
});

// GET LIST OF POSTS

// UNPROTECTED ROUTE

router.get("/feed", (req, res, next) => {
    Feed.find()
        .populate("postedBy")
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            console.log("error getting list of posts", err);
            res.status(500).json({
                message: "error getting list of posts",
                error: err
            });
        })
});

//  GET DETAILS FOR ONE POST


// UNPROTECTED ROUTE

router.get('/feed/:postId', (req, res, next) => {
    
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Feed.findById(postId)
        .populate('event')
        .populate('postedBy')
        .then(post => res.json(post))
        .catch(err => {
            console.log("error getting details of a post", err);
            res.status(500).json({
                message: "error getting details of a post",
                error: err
            });
        })
});

// UPDATE POST BY ID
// NOT IN MVP BUT ROUTE IS HERE AND WORKS IF WE HAVE TIME
// NEEDS ROUTE GUARD

router.put('/feed/:postId', (req, res, next) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Feed.findByIdAndUpdate(postId, req.body, { new: true })
        .then((updatedPost) => res.json(updatedPost))
        .catch(err => {
            console.log("error updating event", err);
            res.status(500).json({
                message: "error updating event",
                error: err
            });
        })
});


// DELETE A POSTS
// NOT IN MVP BUT ROUTE IS HERE AND WORKS IF WE HAVE TIME
// NEEDS ROUTE GUARD

router.delete('/feed/:postId', (req, res, next) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Feed.findByIdAndRemove(postId)
        .then((response) => {
            console.log(response)
            res.json({
                message: `The post: ${response.title} was removed successfully.` })})
        .catch(err => {
            console.log("error deleting event", err);
            res.status(500).json({
                message: "error deleting event",
                error: err
            });
        })
});



module.exports = router;