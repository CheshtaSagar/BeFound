const express = require("express");
const router = express.Router();
const User = require("../models/User");
var auth = require('../config/auth');
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const { storage, upload } = require("../config/grid");
var isUser=auth.isUser;



//upload display picture and 4 profile pictures
router.post(
    "/uploadImages",
    upload.fields([
      { name: "file", maxCount: 1 },
      { name: "file1", maxCount: 1 },
      { name: "file2", maxCount: 1 },
      { name: "file3", maxCount: 1 },
      { name: "file4", maxCount: 1 },
    ]),(req, res) => {
      
       let errors=[];

       if (!req.files["file"] || !req.files["file1"]  || !req.files["file2"]  || !req.files["file3"] || !req.files["file4"] ){
        errors.push({ msg: "Please upload all images" });
      }
      if (errors.length > 0) {
        res.render("editProfile", {
          errors, //    if entries are not according to validation render filled fields
  
        });
      } else
      
        User.findOneAndUpdate(
           {_id: req.user._id },{
            "$set": { "displayPicture": req.files["file"][0].filename ,
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
               console.log( req.files["file"][0].filename);
               res.redirect("/userProfile/editProfile");
             }
           });
          
 });

 module.exports = router;