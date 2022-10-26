// IMPORTING
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // CONVERTING TO JSON
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// GETTING THE NUMBER OF FRIENDS
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// CREATING THE USER MODEL WITH THE USERSCHEMA
const User = model('User', userSchema);

// EXPORTING
module.exports = User;