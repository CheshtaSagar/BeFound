//contains route for profile page that comes after login
//also, here we are recommending users based on location
//also fetching posts of matched users to be shown in newsfeed

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //for storing encrypted password
const passport = require("passport");
const User = require("../models/User");
const Match = require("../models/Match");
const Post = require("../models/Post");
const auth = require('../config/auth');
const isUser = auth.isUser;
var opttitle;



//profile
router.get("/:opttitle", isUser, (req, res) => {
  const loggedIn = req.isAuthenticated() ? true : false;

  let kmToRadian = function (miles) {
    var earthRadiusInMiles = 6378;
    return miles / earthRadiusInMiles; //converting km to miles
  };

  //using geowithin to find users that are within particular radius
  var lg = req.user.location.coordinates[0];
  var lt = req.user.location.coordinates[1];
  opttitle = req.params.opttitle;
  console.log(opttitle);
  var popup = 0;
  var option = {
    'location': {
      $geoWithin: {
        $centerSphere: [[lg, lt], kmToRadian(req.user.radius)]
      }

    }
  };

  if (req.user.recommendedUsers.length == 0)//if we are fetching users based on location for the first time or
  // have updated location 
  {

    //data contains all users which are near to given latitude and longitude
    User.find(option).then(data => {
      console.log("Visiting profile for the first time");

      User.findOneAndUpdate({ _id: req.user._id }, { $set: { recommendedUsers: data } }, { new: true })
      .populate("matchedUsers").exec(
        function (err, doc){
        if (err) {
          console.log("Something went wrong when updating data!");
        }
        else if(doc.matchedUsers) //if we are updating loation then previous matches still exist
        {
          //finding posts of matched users for newsfeed
          Post.find({ "postedBy": { $in: doc.matchedUsers } }).populate("postedBy").sort({ Date: -1 })
          .exec(function (err, posts) {
            if (err) {
              console.log(err);
            }
            else 
            {
              res.render("profile", {
                user: req.user,
                loggedIn: loggedIn,
                recommendedUsers: data,//all users within radius are passed to ejs, 
                popup: popup,         // where we are filtering based on preference.
                likedUser: null,
                opttitle: opttitle,
                posts:posts
              });
              
            }
          });
        }
        else //in case of new user matches will be null
        {
        res.render("profile", {
          user: req.user,
          loggedIn: loggedIn,
          recommendedUsers: data,//all users within radius are passed to ejs, 
          popup: popup,         // where we are filtering based on preference.
          likedUser: null,
          opttitle: opttitle,
          posts:null
        });
       }
      });

    });
    
  }

  else {
    User.findOne({ _id: req.user.id }).populate("recommendedUsers").populate("matchedUsers").exec(
      function (err, docs) {
        if (err) {
          console.log(err);
          throw err;
        }
        else {

          Post.find({ "postedBy": { $in: docs.matchedUsers } }).populate("postedBy").sort({ Date: -1 })
            .exec(function (err, posts) {
              if (err) {
                console.log(err);
              }
              else {
                console.log("Already visited profile before");
                //console.log(docs.recommendedUsers);
                  res.render("profile", {
                  user: req.user,
                  loggedIn: loggedIn,
                  recommendedUsers: docs.recommendedUsers,//all users within radius are passed to ejs, 
                  popup: popup,                          // where we are filtering based on preference.
                  likedUser: null,
                  opttitle: opttitle,
                  posts: posts,
                });
              }
                console.log(posts);
            });
          }
        });
      }

      });



    module.exports = router;