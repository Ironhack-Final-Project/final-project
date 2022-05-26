const router = require("express").Router();

const { default: mongoose } = require("mongoose");
const Feed = require('../models/Feed.model');
const fileUploader = require("../config/cloudinary.config")
const {isAdmin} = require('../middleware/isAdmin.middleware'); 
const { isAuthenticated } = require("../middleware/jwt.middleware");


//CREATE POSTS

//NEEDS ROUTE GUARD
router.post('/feed', isAuthenticated, (req, res, next) => {


    if (!req.payload.isAdmin){
        notAdmin = new Error('notAdmin')
        notAdmin.message = 'You are not authroised to perform this action'
        res.status(401).json(notAdmin.message)
        throw notAdmin
    }


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

    Feed.create(newPost)
        .then(response => res.status(201).json(response))
        .catch(err => {
            console.log("error creating a new post", err);
            res.status(500).json({
                message: "Error creating a new post, please make sure the post has a title and content",
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

router.put('/feed/:postId', isAuthenticated, (req, res, next) => {

    if (!req.payload.isAdmin){
        notAdmin = new Error('notAdmin')
        notAdmin.message = 'You are not authorised to perform this action'
        res.status(401).json(notAdmin.message)
        throw notAdmin
    }

    console.log(req.body)

    if (req.body.title === ''){
        titleError = new Error()
        titleError.message = "Please provide a title"
        res.status(500).json(titleError.message)
        throw titleError
    } else if (req.body.content === ''){
        titleError = new Error()
        titleError.message = "Please provide content"
        res.status(500).json(titleError.message)
        throw titleError
    }
    
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