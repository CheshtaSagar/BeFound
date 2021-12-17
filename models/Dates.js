const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema(
    {

        user1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        user2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        date: {
            type: Date,
        },
        time: {
            type: time,
        },
        location: {
            type: String,
        },
        status:{
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Match", MatchSchema);