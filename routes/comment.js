//contains routes for posting and viewing comments
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

//to post comment on given post
router.post("/post/:id", (req, res) => {

    const comment={
        comment:req.body.comment,
        createdBy: req.user._id 
    };
    Post.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: comment } },
        { new: true },
        function (err, post) {
          if (err) console.log(err);
          else {
            console.log("Commented");
            //console.log(post);
            res.redirect("/profile/newsfeed");
            // res.send(post);
          }
        }
      );  
      
    });


 //to view comments on given post
router.get("/viewAllComments/:id", (req, res) => {

  
  Post.findOne(
      { _id: req.params.id }).sort({time:-1}).exec(
      function (err, post) {
        if (err) console.log(err);
        else {
          console.log("Comments fetched");
          //console.log(post.comments);
          res.redirect("/profile/newsfeed");
        }
      }
    );  
    
  });   



  
module.exports = router;