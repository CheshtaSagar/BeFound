const mongoose = require("mongoose");
const User = require('./User');

const ScheduleDateSchema = new mongoose.Schema(
    {

        user1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        user2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        sdate: {
            type: Date
        },
        stime: {
            type: String
        },
        location: {
            type: String
        },
        theme: {
            type: String
        },
        status:{
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ScheduleDate", ScheduleDateSchema);
