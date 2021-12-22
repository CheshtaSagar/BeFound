//contains routes for creating and managing scheduling of dates
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ScheduleDate = require("../models/ScheduleDate");
const auth = require("../config/auth");
const isUser = auth.isUser;


router.post("/request/:user2id", isUser, (req, res) => {
  console.log(req.body.sdate);
  console.log(req.body.stime);
    try {
    const scheduleDate = new ScheduleDate({
      members: [req.user._id, req.params.user2id],
        // user1:req.user._id,
        // user2:req.params.user2id,
        sdate: req.body.sdate, 
        stime: req.body.stime,
        location: req.body.slocation,
        theme: req.body.stheme,
        status: "not confirmed",
    });
    scheduleDate.save().then((user) => {
        req.flash("success_msg", "Request for date sent successfully ");
        //console.log(scheduleDate);
        console.log("Successfully requested");
        res.redirect("/profile/date");
      });
    
} catch (error) {
    console.log("error in scheduling");
    req.flash("error_msg", "Error in scheduling ");
    res.redirect("/profile/match");
      console.log(error);
}
  });


router.get('/set/:str/:dateid', (req, res) => {
  //var dtid = req.params.dateid;
  //var optresult;
  //console.log(dtid);
  //console.log(status);
  var statusToBeSet;
  if(req.params.str==="accept"){
    statusToBeSet="confirmed";
  }else if(req.params.str==="reject"){
    statusToBeSet="rejected";
  }else if(req.params.str==="cancel"){
    statusToBeSet="canceled";
  }

  
  //if (status == 'inc') {
ScheduleDate.findOneAndUpdate({ _id: req.params.dateid },
  {
    "$set": { "status": statusToBeSet},
    }, { new: true }, function (err, date) {
        if (err){
         req.flash("error_msg", "Oh Snap!! having some error");
          console.log(err);
        }else {
           //optresult = ScheduleDate.find({ members: { $in: [req.user._id] }, }).populate("members");
          console.log(statusToBeSet);
          req.flash("success_msg", "Date "+statusToBeSet);
         // res.status(200).json(optresult);
          res.redirect("/profile/date");
        }
      });

});

//for deleting  
router.get("/delete/:id", isUser, function (req, res) {
  console.log("delete");
  ScheduleDate.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error_msg", "Error while deleting");
      console.log(err);
    } else {
      req.flash("success_msg", "Date deleted!");
      res.redirect("/profile/date");
    }
  });
});


  
module.exports = router;



