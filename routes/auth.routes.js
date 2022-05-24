const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

const router = express.Router();
const saltRounds = 10;
let isAdmin = false

// Create Account
router.post('/signup', (req, res, next) => {
  const { email, password, username, imageUrl, adminKey } = req.body;

  // Check if email or password or name are provided as empty string 
  if (email === '' || password === '' || username === '') {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address.' });
    return;
  }

  if (adminKey === '7') {
    isAdmin = true
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
  // Check the users collection if a user with the same email already exists
  User.findOne({ username })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        return res.status(400).json({ message: "User already exists." });

      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then` 
      return User.create(
        {
          username,
          email,
          password: hashedPassword,
          isAdmin,
          imageUrl
        });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, _id, username } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, _id, username };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch(err => {
      console.log("error creating new user", err);
      res.status(500).json({ message: "Email already in use" })
    });
});


// Login
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  // Check if username or password are provided as empty string 
  if (username === '' || password === '') {
    res.status(400).json({ message: "Provide username and password." });
    return;
  }

  // Check the users collection if a user with the same username exists
  User.findOne({ username })
    .then((foundUser) => {

      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." })
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) { // login was successful

        // Deconstruct the user object to omit the password
        const { _id, username, isAdmin, imageUrl } = foundUser;

        // Create an object that will be set as the token payload
        const payload = {
          _id,
          username,
          isAdmin,
          imageUrl
        };

        // Create and sign the token
        const authToken = jwt.sign(
          payload,
          process.env.TOKEN_SECRET,
          { algorithm: 'HS256', expiresIn: "6h" }
        );

        // Send the token as the response
        res.json({ authToken: authToken });
      }
      else {
        res.status(401).json({ message: "The email and password do not match, please try again" });
      }

    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "Internal Server Error" })
    });
});

// Verify
router.get('/verify', isAuthenticated, (req, res, next) => {

  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log("token is valid", req.payload);
  console.log("req.payload...", req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});

// Add dogs

router.put('/user/:userId/add-dog', (req, res, next) => {
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

  console.log(newDog)

  User.findByIdAndUpdate(req.params.userId, { $push: { dogs: newDog } })
    .populate("dogs")
    .then((response) => {
      res.json(response)
    })
    .catch()
})

router.get('/user/:userId/add-dog', (req, res, next) => {
  User.findById(req.params.userId)
    .populate("dogs")
    .then(response => {
      res.json(response)
    })
    .catch(err => {
      res.status(500).json({
        message: 'error getting dogs',
        error: err
      })
    })
})

router.get('/user/:userId', (req, res, next) => {
  console.log(req.params.userId)
  User.findById(req.params.userId)
    .then(response => { res.json(response) })
    .catch(err => {
      res.status(500).json({
        message: 'error deleting dog',
        error: err
      })
    })
})

router.put('/user/:userId', (req, res, next) => {
  User.findByIdAndUpdate(req.body._id, req.body)
    .then(response => { res.json(response) })
    .catch(err => {
      res.status(500).json({
        message: 'error deleting dog',
        error: err
      })
    })
})

module.exports = router;
