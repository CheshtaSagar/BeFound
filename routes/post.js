//contains routes for creating and managing posts.
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");
const auth = require("../config/auth");
const isUser = auth.isUser;

//for creating a post
router.post("/createPost",isUser, upload.array("file", 10), async(req, res) => {
  User.findOne({ _id: req.user._id }, async(err, user) => {
    if (err) console.log(err);
    else {
      

      try
      {

      var imageList = [];
  
      for (var i = 0; i < req.files.length; i++) {
          var locaFilePath = req.files[i].path;

          // Upload the local image to Cloudinary
          // and get image url as response
          const result = await cloudinary.uploader.upload(locaFilePath,{resource_type:"auto"});
          imageList.push({
             image: result.secure_url,
             cloudinary_id: result.public_id
            });
      }
    }
    catch(err)
      {
        console.log(err);
      }


      const post = new Post({
        description: req.body.description,
        pictures: imageList,
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
router.post('/likePost',isUser, (req, res) => {
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
      }, { new: true }, function (err, post) {
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
  Post.findByIdAndRemove(req.params.id, async function (err,post) {
    if (err) {
      req.flash("error_msg", "Error while deleting");
      console.log(err);
    } else {

      let ids=[];

      for(let i=0;i<post.pictures.length;i++)
      {
        ids.push(post.pictures[i].cloudinary_id);
      }

      try
      {
      await cloudinary.api.delete_resources(ids);
      }
      catch(err)
      {
        console.log(err);
      }


      User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $pull: { posts: req.params.id },
        },
        { new: true }).exec(
          function (err, user1) {
            if (err) {
              console.log(err);
              throw err;
            }
            else {
              console.log(user1.posts);
              req.flash("success_msg", "Post deleted!");
              res.redirect("/profile/newsfeed");

            }
          });
    
        }

      });

    });
  module.exports = router;