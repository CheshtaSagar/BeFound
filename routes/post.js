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
const auth = require("../config/auth");
const isUser = auth.isUser;

//for creating a post
router.post("/createPost", upload.array("file", 10), (req, res) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err) console.log(err);
    else {

      const pics = [];

      for (let i = 0; i < req.files.length; i++)
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
        res.redirect("/profile/newsfeed");
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


//liking a post in newsfeed
router.post('/likePost', (req, res) => {
  var postid = req.query.postid;
  var status = req.query.status;
  //console.log(postid);
  //console.log(status);

  
  if (status == 'inc') {
    Post.findOneAndUpdate({ _id: postid },
      {
        $inc: { likes: 1 },
        $push: { likedBy: req.user }
      }, { new: true }, function (err, post) {
        if (err)
          console.log(err);
        else {
          console.log('liked');
          res.send({ likes: post.likes });
        }
      });
  }
  else {
    Post.findOneAndUpdate({ _id: postid },
      {
        $inc: { likes: -1 },
        $pull: { likedBy: req.user.id }
      }, {new:true},function (err, post) {
        if (err)
          console.log(err);
        else {
          console.log('unliked');
          res.send({ likes: post.likes });
        }

      });
  }

});


//for deleting  
router.get("/delete/:id", isUser, function (req, res) {
  console.log("delete");
  Post.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      req.flash("error_msg", "Error while deleting");
      console.log(err);
    } else {
      req.flash("success_msg", "Date deleted!");
      res.redirect("/profile/newsfeed");
    }
  });
});

module.exports = router;