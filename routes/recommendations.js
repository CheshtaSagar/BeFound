//contains routes for deleting and liking recommended users (based on location and gender)
//also for creating match between users who have mutually liked the profiles
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Match = require("../models/Match");
const auth = require('../config/auth');
const isUser = auth.isUser;


router.get("/deleteRecommendedUser/:id", isUser, (req, res) => {
  const loggedIn = req.isAuthenticated() ? true : false;
  var popup=0;
  User.findOneAndUpdate(
    { _id: req.user.id },
    { $pull: { recommendedUsers: req.params.id } },
    { new: true }).populate("recommendedUsers").exec(
      function (err, docs) {
        if (err) {
          console.log(err);
          throw err;
        }
        else {
          console.log(req.params.id + " deleted");
          res.render("profile", {
            user: req.user,
            loggedIn: loggedIn,
            recommendedUsers: docs.recommendedUsers,
            popup: popup,
            likedUser: null,
            opttitle: "newsfeed",

          });
        }

      });

});


//1)User likes a profile(user1)
//2)Find the id of liked profile(user2)
//3)In user1's likedUsers array add id of user2 and remove it from recommendedUsers.
//4)In user2, check if user1 is there in liked array or not
//5)if yes,then match found, then show popup to the user and save the match id in database
//6)else simply continue with /profile/newsfeed
router.get("/likeRecommendedUser/:id", isUser, (req, res) => {
  const loggedIn = req.isAuthenticated() ? true : false;

  var popup = 0;
  //remove liked user from recommends and add it to liked array
  User.findById({ _id: req.params.id }, function (err, likedUser) {
    if (err)
      console.log(err);

    User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $pull: { recommendedUsers: req.params.id },
        $push: { likedUsers: likedUser }
      },
      { new: true }).populate("recommendedUsers").exec(
        function (err, docs) {
          if (err) {
            console.log(err);
            throw err;
          }
          else {

            //if likedUser also contains user id in its likedUsers array,then it is a match
            console.log(req.user.username + " likes " + likedUser.username);
            

            User.findOne(
              { _id: likedUser.id, likedUsers: req.user.id },
              function (err, matchFound) {
                if (err) {
                  console.log(err);
                  throw err;
                }
                if (matchFound) {
                    popup = 1;
                    console.log("match Found");

                    //create a new entry in match collection
                    const newMatch = new Match({
                    "members" : [ req.user.id ,likedUser.id ]
                    });
                    
                    newMatch.save().then((user) => {
                    console.log("new match created");
                    console.log(newMatch._id);
                    res.render("profile", {
                    user: req.user,
                    loggedIn: loggedIn,
                    recommendedUsers: docs.recommendedUsers,
                    likedUser: likedUser,
                    popup: popup,//will use this to show popup on frontend for match found
                    opttitle: "newsfeed",
                  });

                  //puhing match id in both the users' matches field   
                  User.updateMany(
                    { _id: { $in : [req.user.id,likedUser.id] }},
                    { $push: { matches: newMatch } },
                    { new: true },
                    function (err, doc) {
                      if (err) console.log(err);
                      else {
                        console.log(req.user.id + " "+ likedUser.id);
                      }
                    }
                  );

                });
                }
                else {

                  res.render("profile", {
                    user: req.user,
                    loggedIn: loggedIn,
                    recommendedUsers: docs.recommendedUsers,
                    popup: popup,
                    likedUser: null,
                    opttitle: "newsfeed",
                  });

                }
              });

          }

        });

  });


});


module.exports = router;