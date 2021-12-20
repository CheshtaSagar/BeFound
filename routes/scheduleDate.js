//contains routes for creating and managing scheduling of dates
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ScheduleDate = require("../models/ScheduleDate");
const auth = require("../config/auth");
const isUser = auth.isUser;

//to post updates or info regarding company
router.post("/request/:user2id", isUser, (req, res) => {
    try {
    const scheduleDate = new ScheduleDate({
        user1:req.user._id,
        user2:req.params.user2id,
        sdate: req.body.sdate, 
        stime: req.body.stime,
        location: req.body.slocation,
        theme: req.body.stheme,
        status: "not confirmed",
    });
    scheduleDate.save().then((user) => {
        req.flash("success_msg", "Request for date sent successfully ");
        console.log(scheduleDate);
        console.log("Successfully requested");
        res.redirect("/profile/match");
      });
    
} catch (error) {
    console.log("error in scheduling");
    req.flash("error_msg", "Error in scheduling ");
    res.redirect("/profile/match");
      console.log(error);
}
  });


  
module.exports = router;



