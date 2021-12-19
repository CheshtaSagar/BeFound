const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require('../config/auth');
const isUser=auth.isUser;

router.get("/find",async (req, res) => {
    try {
       var optresult = await User.findOne({ _id: req.user.id }).populate("matches");
        console.log(optresult.matches);
        console.log("hi");
        res.status(200).json(optresult);
      } catch (err) {
        res.status(500).json(err);
      }
  });



  router.get("/findmatch/matches",async (req, res) => {
    try {
       var optresult = await User.findOne({ _id: req.user.id }).populate("matches");
        console.log(optresult.matches);
        console.log("hi");
        res.status(200).json(optresult);
      } catch (err) {
        res.status(500).json(err);
      }
  });


  // if(opttitle==='match'){
  //   try {
  //     optresult = await User.findOne({ _id: req.user.id }).populate("matches");
  //     console.log(optresult.matches);
  //     console.log("hi");
  //   } catch (err) {
  //     res.redirect("/login");
  //   }
  //   }



module.exports = router;