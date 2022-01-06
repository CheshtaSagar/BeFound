//for uploading dp and profile pictures
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require('../config/auth');
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");
const isUser = auth.isUser;



//upload display picture
router.post("/displayPicture", isUser, upload.single("file"), async (req, res) => {


  let errors = [];

  if (!req.file) {
    errors.push({ msg: "Please select an image first" });
  }
  if (errors.length > 0) {
    res.render("editProfile", {
      errors, //    if entries are not according to validation render filled fields

    });
  } else {


    try {
      const user = await User.findById(req.user._id);

      //delete existing dp from cloudinary if dp is already set
      if (user.displayPicture != '{}')
        await cloudinary.uploader.destroy(user.displayPicture.cloudinary_id);

      const result = await cloudinary.uploader.upload(req.file.path);


      await User.findOneAndUpdate({ _id: req.user._id }, {
        "$set": {
          "displayPicture":
          {
            "image": result.secure_url,
            "cloudinary_id": result.public_id,
          }
        }
      }, { new: true });

      console.log("picture updated");
      req.flash("success_msg", "Display Picture Updated");

      res.redirect("/userProfile/editProfile");




    }
    catch (err) {
      console.log(err);
    }

  }

});




//upload 4 profile pictures
router.post(
  "/uploadImages", isUser,
  upload.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
    { name: "file3", maxCount: 1 },
    { name: "file4", maxCount: 1 },
  ]), async (req, res) => {


    let errors = [];

    if (!req.files["file1"] || !req.files["file2"] || !req.files["file3"] || !req.files["file4"]) {
      errors.push({ msg: "Please upload all images" });
    }
    if (errors.length > 0) {
      res.render("editProfile", {
        errors, //    if entries are not according to validation render filled fields

      });
    }
    else {



      var imageList = [];

      const user = await User.findById(req.user._id);

      if(user.profilePictures.length > 0)
      {
        let pictureIds=[];

        for(let i=0;i<4;i++)
        {
          pictureIds.push(user.profilePictures[i].cloudinary_id);
        }
        console.log(pictureIds);
       
        try
        {
        await cloudinary.api.delete_resources(pictureIds);
        }
        catch(err)
        {
          console.log(err);
        }

      }
      for (var i = 1; i <= 4; i++) {

        var name = "file" + i;

        var localFilePath = req.files[name][0].path;

        // Upload the local image to Cloudinary
        // and get image url as response
        try {
          const result = await cloudinary.uploader.upload(localFilePath);
          imageList.push({
            image: result.secure_url,
            cloudinary_id: result.public_id
          });
        }
        catch (err) {
          console.log(err);
        }




      }


      User.findOneAndUpdate(
        { _id: req.user._id }, {
        "$set": {
          "profilePictures": imageList
        }
      },
        function (err, docs) {
          if (err) {
            throw err;
          }
          else if (docs) {
            console.log("updated");
            req.flash("success_msg", "Media uploaded");

            res.redirect("/userProfile/editProfile");
          }
        });


    }


  });

module.exports = router;