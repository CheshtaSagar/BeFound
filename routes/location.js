const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require('../config/auth');
const isUser = auth.isUser;


//1)set new location in user schema
//2)unset the recommended users field
//3)redirect to profile
//4)profile will fetch new recommendations based on new location
router.get('/changeLocation/:lat/:long', isUser, (req, res) => {

    const loggedIn = req.isAuthenticated() ? true : false;

    longitude = req.params.long;
    latitude = req.params.lat;

    console.log("inside this");
    console.log(req.params.long);
    console.log(req.params.lat);
    //const location = [longitude, latitude] ;
    //const location = ['80.0001000', '27.02002020'] ;
    const location = {"type":"Point","coordinates":[longitude, latitude]};
    User.findOneAndUpdate(
        {_id: req.user._id },
        { $set: {location : location },
          $unset: {recommendedUsers : "" }}, //unset recommended users as new entries will be fetched
        function (err, docs) {
          if (err) {
            throw err;
          }
          else if (docs) {
            console.log("location updated: " + longitude +" "+ latitude);
            console.log(req.user._id);
            res.redirect("/profile");
          }
        }
        );
});

module.exports = router;