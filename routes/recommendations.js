//contains routes for deleting and liking recommended users (based on location and gender)
//also for creating match between users who have mutually liked the profiles
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Match = require("../models/Match");
const Post = require("../models/Post");
const ScheduleDate = require("../models/ScheduleDate");
const auth = require('../config/auth');
const isUser = auth.isUser;
var optresult="";

router.get("/deleteRecommendedUser/:id", isUser, async(req, res) => {
  const loggedIn = req.isAuthenticated() ? true : false;
  var popup = 0;

  try {
    optdate = await ScheduleDate.find({ members: { $in: [req.user._id] }, }).populate("members").sort({ sdate : 1 });
  } catch (err) {
    optdate=null;
    console.log("error in finding dates");
  }
  User.findOne(
    { _id: req.params.id },
    function (err, unlikedUser) {
      if (err) {
        console.log(err);
        throw err;
      }
      else {

        User.findOneAndUpdate(
          { _id: req.user.id },
          {
            $pull: { recommendedUsers: req.params.id },
            $push: { unlikedUsers: unlikedUser },
          },
          { new: true }).populate("recommendedUsers").exec(
            function (err, docs) {
              if (err) {
                console.log(err);
                throw err;
              }
              else {

                let creators = docs.matchedUsers.slice();
                creators.push(docs);
      
                Post.find({ "postedBy": { $in: creators } }).populate("postedBy").populate("comments.createdBy").sort({ Date: -1 })
                  .exec(function (err, posts) {
                    if (err) {
                      console.log(err);
                    }
                    else {
                      
                      //console.log(docs.recommendedUsers);
                      //console.log(docs.matchedUsers);
                     
                      if (docs.matchedUsers.length > 0)
                        optresult = docs.matchedUsers;
                     
                console.log(req.params.id + " deleted");
                res.render("profile", {
                  user: req.user,
                  loggedIn: loggedIn,
                  recommendedUsers: docs.recommendedUsers,
                  popup: popup,
                  likedUser: null,
                  opttitle: "newsfeed",
                  posts: posts,
                  optresult:optresult,
                  optdate:optdate,
                });

              }});
              }

            });

      }
    });

});


//1)Check if user2(liked profile) also likes user1
//2)If yes,match found, popup value becomes 1
//3)   In user1's and user2's matchedUsers array, add ids of one another
//4)   From user1,remove user2 from recommendedUsers array and from user2, remove user1 from likedUsers array
//5)   Direct to profile
//6)Else
//7)   From user1,remove user2 from recommendedUsers and add it in likedUsers
//8)   Direct to profile

router.get("/likeRecommendedUser/:id", isUser, async(req, res) => {
  const loggedIn = req.isAuthenticated() ? true : false;

  var popup = 0;
  var optresult="";

  try {
    optdate = await ScheduleDate.find({ members: { $in: [req.user._id] }, }).populate("members").sort({ sdate : 1 });
  } catch (err) {
    optdate=null;
    console.log("error in finding dates");
  }


  User.findOne(
    { _id: req.params.id, likedUsers: req.user.id },
    function (err, matchFound) {
      if (err) {
        console.log(err);
        throw err;
      }

      if (matchFound) {
        popup = 1;
        console.log("match Found");

        //removing user2 from recommendedUsers of user1 and adding it to matchedUsers
        User.findOneAndUpdate(
          { _id: req.user.id },
          {
            $pull: { recommendedUsers: req.params.id },
            $push: { matchedUsers: matchFound }
          },
          { new: true }).populate("recommendedUsers").populate("matchedUsers").exec(
            function (err, user1) {
              if (err) {
                console.log(err);
                throw err;
              }


              //removing user1 from likedUsers of user2 and adding it to matchedUsers
              User.findOneAndUpdate(
                { _id: req.params.id },
                {
                  $pull: { likedUsers: req.user.id },
                  $push: { matchedUsers: user1 }
                },
                { new: true }).exec(
                  function (err, user2) {
                    if (err) {
                      console.log(err);
                      throw err;
                    }

                    console.log("new match created");
                    console.log("user1: " + user1.username + " matched with user2: " + user2.username);
                    //console.log(user1.matchedUsers);

                    let creators = user1.matchedUsers.slice();
                    creators.push(user1);
          
                    Post.find({ "postedBy": { $in: creators } }).populate("postedBy").populate("comments.createdBy").sort({ Date: -1 })
                      .exec(function (err, posts) {
                        if (err) {
                          console.log(err);
                        }
                        else {
                          
                          //console.log(docs.recommendedUsers);
                          //console.log(docs.matchedUsers);
                         
                          if (user1.matchedUsers.length > 0)
                            optresult = user1.matchedUsers;
                         

                    res.render("profile", {
                      user: req.user,
                      loggedIn: loggedIn,
                      recommendedUsers: user1.recommendedUsers,
                      matchedUsers: user1.matchedUsers,
                      optresult: optresult,
                      likedUser: user2,
                      popup: popup,//will use this to show popup on frontend for match found
                      opttitle: "newsfeed",
                      posts: posts,
                      optdate:optdate,
                    });

                        }});

                  });

            });

      }
      else //match not found which means no likedUser returned
      {


        User.findById({ _id: req.params.id }, function (err, likedUser) {
          if (err)
            console.log(err);

          //remove user2's id from recommendedUsers and add it to likedUsers
          User.findOneAndUpdate(
            { _id: req.user.id },
            {
              $pull: { recommendedUsers: req.params.id },
              $push: { likedUsers: likedUser }
            },
            { new: true }).populate("recommendedUsers").populate("matchedUsers").exec(
              function (err, user1) {
                if (err) {
                  console.log(err);
                  throw err;
                }

                console.log("user1: " + user1.username + " likes user2: " + likedUser.username);
                //console.log(user1.matchedUsers);
                //render profile 

                let creators = user1.matchedUsers.slice();
                    creators.push(user1);
          
                    Post.find({ "postedBy": { $in: creators } }).populate("postedBy").populate("comments.createdBy").sort({ Date: -1 })
                      .exec(function (err, posts) {
                        if (err) {
                          console.log(err);
                        }
                        else {
                          if (user1.matchedUsers.length > 0)
                          optresult = user1.matchedUsers;
                          else
                          optresult="";
                res.render("profile", {
                  user: req.user,
                  loggedIn: loggedIn,
                  recommendedUsers: user1.recommendedUsers,
                  matchedUsers: user1.matchedUsers,
                  optresult:user1.matchedUsers,
                  popup: popup,
                  likedUser: null,
                  opttitle: "newsfeed",
                  posts: posts,
                  optdate:optdate,
                });

              }});
              });




        });
      }


    });


});
module.exports = router;