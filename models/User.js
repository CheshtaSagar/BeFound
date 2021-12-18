
const mongoose = require("mongoose");
const Post = require('./Post');
const Match = require('./Match');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  city:
  {
    type: String,
    required: true,
  },
  age:
  {
    type: Number,
    required: true,
  },
  preferences: //to be made array later
  {
    type: String,
    required:true,
  },
  radius:
  {
    type:Number,
    required: true,
  },
  bio:
  {
    type: String,

  } ,
  displayPicture:
  {
    type: String,
  },
  profilePictures:[
    {
      type: String
    }
  ],
   location:{
       type:{
         type:String,
         enum: ['Point'],
         default: "Point"
       },
       coordinates:{
         type: [Number],
         index: "2dsphere"
       },

   },
   recommendedUsers:[     //stores all users that are recommended to the current logged in user
    {
     type: mongoose.Schema.Types.ObjectId,
     ref:'User'
    }
  ],
  likedUsers: [     //stores all users that the current user likes
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
     }
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Post'
     }
  ],
  matchedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
     }
  ],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;