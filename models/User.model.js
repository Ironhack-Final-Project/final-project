const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    eventsAttending: [{
      type: Schema.Types.ObjectId, 
      ref: 'Event',
    }],
    isAdmin: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: 'https://res.cloudinary.com/diqphio4g/image/upload/v1653229032/movie-gallery/defaultProfilePic_snkpys.jpg'},
    dogs: [
      {
        name: String,
        breed: String,
        notes: String,
        imageUrl: {
          type: String,
          default: "https://res.cloudinary.com/diqphio4g/image/upload/v1653315126/movie-gallery/default-dog_let60w.jpg"},
      }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
