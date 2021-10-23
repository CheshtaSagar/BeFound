//contains route for profile page that comes after login
//also, here we are recommending users based on location

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //for storing encrypted password
const passport = require("passport");
const User = require("../models/User");
const auth = require('../config/auth');
const isUser=auth.isUser;



//profile
router.get("/",isUser, (req, res) => {
    const loggedIn = req.isAuthenticated() ? true : false;
  
    let kmToRadian = function(miles){
      var earthRadiusInMiles = 6378;
      return miles / earthRadiusInMiles; //converting km to miles
   };
  
   //using geowithin to find users that are within particular radius
   var lg=req.user.location.coordinates[0];
   var lt=req.user.location.coordinates[1];
    var option = {
       'location' : {
        $geoWithin : {
              $centerSphere :  [[lg ,lt ] , kmToRadian(req.user.radius)  ]
      }
    }
  };
  
    if(req.user.recommendedUsers!=null)//if we are fetching users based on loaction for the first time
    {
    User.find(option).then(data =>{
      console.log(data);
  
      User.findOneAndUpdate({_id: req.user._id}, {$set:{recommendedUsers: data }}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
          res.render("profile", {
          user: req.user,
          loggedIn: loggedIn,
          recommendedUsers: data,//all users within radius are passed to ejs, 
                               // where we are filtering based on preference.
          });
        
    });
  
        
    });
    }
  
    else
    {
        User.findOne({ _id: req.user.id }).populate("recommendedUsers").exec(
        function (err, docs) {
          if (err) {
            console.log(err);
            throw err;
          }
          else
          {
            res.render("profile", {
              user: req.user,
              loggedIn: loggedIn,
              recommendedUsers: docs,//all users within radius are passed to ejs, 
                                   // where we are filtering based on preference.
              });
          }
    });
  
  }
    
  });
  


module.exports = router;