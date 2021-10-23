//contains routes for edit profile 
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require('../config/auth');
const isUser=auth.isUser;



router.get("/editProfile", isUser,(req, res) => {
    res.render("editProfile", {
    user: req.user
    });
});


//to edit user profile
router.post("/editProfile",isUser, (req, res)=> {
 console.log(req.user.email);

 var  person= {
     email:req.body.email,
     username: req.body.username,
     gender: req.body.gender,
     city: req.body.city,
     age: req.body.age,
     preferences: req.body.preferences,
     radius: req.body.radius,
     bio: req.body.bio,
 };
console.log(person);
 User.findOneAndUpdate(
    {_id: req.user._id },
    { $set: person },
    function (err, docs) {
      if (err) {
        throw err;
      }
      else if (docs) {
        console.log("updated");
        req.flash("success_msg", "Profile Updated");
        console.log(req.user._id);
        res.redirect("editProfile");
      }
    });

});

module.exports = router;