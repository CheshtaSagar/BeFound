const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    createdBy:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Date:
    {
        type: Date,
        default: Date.now
    },
    comment:
    {
        type: String
    }
},
{ timestamps: true });

const Comment = mongoose.model("Comment",CommentSchema);
module.exports = Comment;