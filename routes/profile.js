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
const Post = require("../models/Post");
const auth = require("../config/auth");
const isUser = auth.isUser;
var opttitle;
var optresult = null;

//profile
router.get("/:opttitle", isUser, async (req, res) => {
  const loggedIn = req.isAuthenticated() ? true : false;

  let kmToRadian = function (miles) {
    var earthRadiusInMiles = 6378;
    return miles / earthRadiusInMiles; //converting km to miles
  };



  //using geowithin to find users that are within particular radius
  var lg = req.user.location.coordinates[0];
  var lt = req.user.location.coordinates[1];
  opttitle = req.params.opttitle;
  //console.log(opttitle);

  


  try {
    demoUser = await User.findOne({ _id: req.user.id });
    //console.log(optresult.matchedUsers);
    //console.log("hi");
  } catch (err) {
     console.log(err);

  }


  var popup = 0;
  var option = {
    location: {
      $geoWithin: {
        $centerSphere: [[lg, lt], kmToRadian(req.user.radius)],
      }
    },
    _id :{ 
      $nin : demoUser.likedUsers
    },
    gender:
    { 
      $in : demoUser.preferences
    }
     
  };



  if (req.user.recommendedUsers.length == 0)//if we are fetching users based on location for the first time or
  // have updated location 
  {

    //data contains all users which are near to given latitude and longitude
    User.find(option).then(data => {

      console.log(data);
      User.findOneAndUpdate({ _id: req.user._id }, { $set: { recommendedUsers: data } }, { new: true })
        .populate("matchedUsers").exec(
          function (err, doc) {
            if (err) {
              console.log("Something went wrong when updating data!");
            }
            else if (doc.matchedUsers) //if we are updating loation then previous matches still exist
            {
              //finding posts of matched users for newsfeed
              var creators = doc.matchedUsers;
              creators.push(req.user._id);
              //console.log(creators);
              Post.find({ "postedBy": { $in: creators } }).populate("postedBy").sort({ Date: -1 })
                .exec(function (err, posts) {
                  if (err) {
                    console.log(err);
                  }
                  else {

                    console.log(doc.matchedUsers);
                    res.render("profile", {
                      user: req.user,
                      loggedIn: loggedIn,
                      recommendedUsers: data,//all users within radius are passed to ejs, 
                      popup: popup,         // where we are filtering based on preference.
                      likedUser: null,
                      opttitle: opttitle,
                      posts: posts,
                      optresult: doc.matchedUsers
                    });

                  }
                });
            }
            else //in case of new user ,matches will be null
            {
              console.log("Visiting profile for the first time");
              console.log(doc.matchedUsers);
              res.render("profile", {
                user: req.user,
                loggedIn: loggedIn,
                recommendedUsers: data,//all users within radius are passed to ejs, 
                popup: popup,         // where we are filtering based on preference.
                likedUser: null,
                opttitle: opttitle,
                posts: null,
                optresult: null,
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
          
          //console.log(docs.matchedUsers);
          let creators = docs.matchedUsers.slice();
         
          Post.find({ "postedBy": { $in: creators } }).populate("postedBy").populate("comments.createdBy").sort({ Date: -1 })
            .exec(function (err, posts) {
              if (err) {
                console.log(err);
              }
              else {
                console.log("Already visited profile before");
                //console.log(docs.recommendedUsers);
                //console.log(docs.matchedUsers);
                
                if(docs.matchedUsers.length>0)
                optresult=docs.matchedUsers;
                else
                optresult="";
                
                //console.log(optresult);
                res.render("profile", {
                  user: req.user,
                  loggedIn: loggedIn,
                  recommendedUsers: docs.recommendedUsers,//all users within radius are passed to ejs, 
                  popup: popup,                          // where we are filtering based on preference.
                  likedUser: null,
                  opttitle: opttitle,
                  posts: posts,
                  optresult: optresult,
                });

                // console.log(posts);
              }

            });
        }
      });
  }

});



module.exports = router;

