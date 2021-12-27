const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require('../config/auth');
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const { storage, upload } = require("../config/grid");
const isUser=auth.isUser;



 //upload display picture
router.post("/displayPicture",isUser,upload.single("file"),(req, res) => {

    
     let errors=[];

     if (!req.file){
      errors.push({ msg: "Please select an image first" });
    }
    if (errors.length > 0) {
      res.render("editProfile", {
        errors, //    if entries are not according to validation render filled fields

      });
    } else
    
      User.findOneAndUpdate(
         {_id: req.user._id },{
          "$set": { "displayPicture": req.file.filename}},
         function (err, docs) {
           if (err) {
             throw err;
           }
           else if (docs) {
             console.log("updated");
             req.flash("success_msg", "Display Picture Updated");
            
             res.redirect("/userProfile/editProfile");
           }
         });
        
});

 //upload 4 profile pictures
router.post(
  "/uploadImages",isUser,
  upload.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
    { name: "file3", maxCount: 1 },
    { name: "file4", maxCount: 1 },
  ]),(req, res) => {

  
     let errors=[];

     if (!req.files["file1"]  || !req.files["file2"]  || !req.files["file3"] || !req.files["file4"] ){
      errors.push({ msg: "Please upload all images" });
    }
    if (errors.length > 0) {
      res.render("editProfile", {
        errors, //    if entries are not according to validation render filled fields

      });
    } else
    
      User.findOneAndUpdate(
         {_id: req.user._id },{
          "$set": { 
          "profilePictures": [ req.files["file1"][0].filename ,
          req.files["file2"][0].filename ,
          req.files["file3"][0].filename ,
          req.files["file4"][0].filename ]},
          },
         function (err, docs) {
           if (err) {
             throw err;
           }
           else if (docs) {
             console.log("updated");
             req.flash("success_msg", "Profile Updated");
            
             res.redirect("/userProfile/editProfile");
           }
         });
        
});

 module.exports = router;