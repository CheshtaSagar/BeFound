//contains routes for edit profile 
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require('../config/auth');
const {headingDistanceTo} = require("geolocation-utils");
const isUser=auth.isUser;


router.get('/:id',isUser, (req, res) => {
    const loggedIn = req.isAuthenticated() ? true : false;
    User.findOne({_id: req.params.id},(err, doc) => {
        if (err) {
            console.log("Something went wrong!");
        }

        const location1 = [ req.user.location.coordinates[1], req.user.location.coordinates[0]];
        const location2 = [ doc.location.coordinates[1],doc.location.coordinates[0]];
       // const location2 =[28.374373861864143, 79.43329499987898];
        const headingDistance=headingDistanceTo(location1, location2);
        const dist=headingDistance.distance /1000; //m to km
        var rounded = Math.round( dist * 10 ) / 10;
        console.log("User location : " + req.user.location.coordinates);
        console.log("Doc user location :" + doc.location);
        console.log("Distance between them: "+ rounded);
        
          res.render("showProfile", {
          user: req.user,
          loggedIn: loggedIn,
          doc: doc,
          distance: rounded,
          });
        
    });
});
module.exports = router;