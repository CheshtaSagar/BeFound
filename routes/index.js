const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //for storing encrypted password
const passport = require("passport");
const User = require("../models/User");
const auth = require('../config/auth');
const isUser=auth.isUser;
var longitude,latitude;

//rendering home page
router.get("/", (req, res) => {
  res.render("index");
});

//login
router.get("/login", function (req, res) {
  res.render("login");
});

//register
router.get("/register", function (req, res) {
  res.render("register");
});



//Register post Handling
router.post("/register/:lat/:long", (req, res) => {
  longitude=req.params.long;
  latitude=req.params.lat;
  
   console.log(req.params.long);
   console.log(req.params.lat);
  const { username, email, password, password2, gender, city, age, preferences, radius, bio } = req.body;
  const location = {"type":"Point","coordinates":[longitude, latitude]};
  
  let errors = [];
  //validation for email
  function isLowerCase(str) {
    return str === str.toLowerCase();
  }

  //Validations for registration form
  if (!username || !email || !password || !password2 || !gender || !city || !age || !preferences || !radius) {
    errors.push({ msg: "Please enter all fields" });
  }
  if(!location)
  {
    errors.push({msg : "Please give access to location"});
  }
  if (!isLowerCase(email)) {
    errors.push({ msg: "Email cannot be in upper case" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 5) {
    errors.push({ msg: "Password must be at least 5 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors, //    if entries are not according to validation render filled fields
      user,
      email,
      password,
      password2,
      gender,
      city,
      age,
      preferences,
      radius,
      bio,
      
    });
  } else {
    //if Validations passed
    User.findOne({ username: username }).then((user) => {
      if (user) {
        errors.push("username is already Exists");
        res.send("username exists")
          res.render("register", {
            errors,
            email,//if email already exists render the fields
            password,
            password2,
            gender,
            city,
            age,
            preferences,
            radius,
            bio,

          }
          );
      }
       else {
           User.findOne({email:email}).then((user)=>{
               if(user){
                errors.push("email is already Exists");
          res.render("register", {
            errors,
            email, //if email already exists render the fields
            password,
            password2,
            gender,
            city,
            age,
            preferences,
            radius,
            bio,

          }
          );
               }
               else{
                const newUser = new User({
                    username,
                    email,///if all validation passed store a new User indb
                    password,
                    password2,
                    gender,
                    city,
                    age,
                    preferences,
                    radius,
                    bio,
                    location,
                    
                  });
                
                  //to save password in hash format(pass the plain password and hash will be the encyrpted password)
                  bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
                      //set password to hash
                      newUser.password = hash;
                      //save the developer
                      newUser
                        .save()
                        .then((user) => {
                          req.flash(
                            "success_msg",
                            "Registered Successfully and can log in "
                          );
                          res.redirect("/login");
                        })
                        .catch((err) => console.log(err));
                    })
                  );
               }
           })
      }
    });
  }
});

//login handling
router.post("/login", (req, res, next) => {
 
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});





// Logout handling
router.get("/logout",isUser, (req, res) => {
  req.logout(); //passport middleware function
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

module.exports = router;
