//contains routes for edit profile 
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require('../config/auth');
const isUser=auth.isUser;


router.get('/:id',isUser, (req, res) => {
    const loggedIn = req.isAuthenticated() ? true : false;
    User.findOne({_id: req.params.id},(err, doc) => {
        if (err) {
            console.log("Something went wrong!");
        }
          res.render("showProfile", {
          user: req.user,
          loggedIn: loggedIn,
          doc: doc, 
          });
        
    });
});
module.exports = router;