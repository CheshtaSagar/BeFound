//contains routes for creating and managing posts.
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const { storage, upload } = require("../config/grid");

//to post updates or info regarding company
router.post("/createPost", upload.array("file",10), (req, res) => {
    User.findOne({ _id: req.user._id }, (err, user) => {
      if (err) console.log(err);
      else {

        const pics=[];
        
        for(let i=0;i<req.files.length;i++)
        pics.push(req.files[i].filename);

        console.log(pics);

        const post = new Post({
          description: req.body.description,
          pictures: pics,
          postedBy: user._id,
        });

        post.save().then((user) => {
          req.flash("success_msg", "Posted successfully ");
          console.log("Successfully posted");
          res.redirect("/profile");
        });

        User.findOneAndUpdate(
          { _id: user._id },
          { $push: { posts: post } },
          { new: true },
          function (err, doc) {
            if (err) console.log(err);
            else {
              console.log(doc._id);
            }
          }
        );
      }
    });
  });


  
module.exports = router;