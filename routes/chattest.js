const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const User = require("../models/User");

router.get("/:id", (req, res) => {
        Conversation.find({members: { $in: [req.params.id] },}).populate("members").exec(function(err,conversation){
          if(err){
            console.log(err);
          }else{
            console.log("hii");
            conversation.forEach(function(c){
              console.log(c.members[1]);

            })
            console.log("hii");
             res.render("chattest", {
          conversation: conversation,
          title: 'none',
      });
          }
        });
        
  });



module.exports = router;