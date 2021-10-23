const express = require("express");
const router = express.Router();
const Message = require("../models/Message");



//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

// router.get("/:conversationId", async (req, res) => {
//   try {
//     Message.find({
//       conversationId: req.params.conversationId,
//     }).exec(err,messgs)
//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get("/:conversationId", async (req, res) => {
  Message.find({
          conversationId: req.params.conversationId,
        }).populate("members").exec(function(err,messgs){
    if(err){
      console.log(err);
    }else{
      console.log(messgs);
      // messgs.forEach(function(c){
      //   console.log(c.members[1]);

      // })
//     res.render("chat", {
//     conversation: conversation,
//     title: 'none',
// });
res.send(messgs)
    }
  });
});



module.exports = router;