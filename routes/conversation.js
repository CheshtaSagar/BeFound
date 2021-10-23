const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new conv

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  console.log(added);
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
    // res.render("chat", {
    //   conversation:conversation,
    // });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId



router.get("/find/:firstUserId/:secondUserId", (req, res) => {

  Conversation.find({ members: { $in: [req.user._id] }, }).populate("members").exec(function (err, conversation) {
    if (err) {
      console.log(err);
    } else {
      Conversation.find({ members: { $all: [req.params.firstUserId, req.params.secondUserId] }, }).populate("members").exec(function (err, personalchat) {
        if (err) {
          console.log(err);
        } else {
          res.render("chat", {
            conversation: conversation,
            personalchat: personalchat,
            title: 'start converse',
          });
        }
      });
    }
  });

});

module.exports = router;




// router.get("/:id", (req, res) => {
//   Conversation.aggregate([{
//     $lookup: {
//             from: "User",
//             localField: "members",
//             foreignField: "_id",
//             as: "convers",
//         }
// }]).exec(function(err,conversation){
//     if(err){
//       console.log(err);
//     }else{
//       console.log("hii");
//       console.log(conversation);
//       console.log("hii");
//        res.render("chat", {
//     conversation: conversation,
// });
//     }
//   });

// });