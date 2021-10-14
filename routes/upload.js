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
      
       
        User.findOneAndUpdate(
           {_id: req.user._id },{
            "$set": { "displayPicture": req.files["file"][0].filename },
            "$set": { "profilePictures": [ req.files["file1"][0].filename ,
            req.files["file2"][0].filename ,
            req.files["file3"][0].filename ,
            req.files["file4"][0].filename ]}
            },
           function (err, docs) {
             if (err) {
               throw err;
             }
             else if (docs) {
               console.log("updated");
               req.flash("success_msg", "Profile Updated");
               console.log(req.user._id);
               res.redirect("/userProfile/editProfile");
             }
           });
       
 });

 module.exports = router;