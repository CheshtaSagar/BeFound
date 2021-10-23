//contains routes for deleting and liking recommended users (based on location and gender)

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require('../config/auth');
const isUser = auth.isUser;


router.get("/deleteRecommendedUser/:id", isUser, (req, res) => {
  const loggedIn = req.isAuthenticated() ? true : false;
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
          console.log(docs.recommendedUsers);
          res.render("profile", {
            user: req.user,
            loggedIn: loggedIn,
            recommendedUsers: docs.recommendedUsers,
          });
        }

      });

});

router.get("/likeRecommendedUser/:id", isUser, (req, res) => {
  const loggedIn = req.isAuthenticated() ? true : false;


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
            console.log(req.user.username + " likes " + docs.likedUser.username);
            res.render("profile", {
              user: req.user,
              loggedIn: loggedIn,
              recommendedUsers: docs.recommendedUsers,
            });
          }

        });

  });

});



module.exports = router;