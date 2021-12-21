const mongoose = require('mongoose');
const User = require('./User');
//schema for posts
const PostSchema = new mongoose.Schema({
    postedBy:
    {   
        type: mongoose.Schema.Types.ObjectId,
        ref:  "User"  
    },
    Date:
    {
        type: Date,
        default:Date.now
    },
    description:
    {
        type: String
    },
    pictures:[
        {
          type: String
        }
      ],
    likes:
    {
        type: Number,
        default:0
    },
    likedBy:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        } 
    ],
    comments:[
        {
           comment:
           {
               type: String
           },
           createdBy:
           {
            type: mongoose.Schema.Types.ObjectId,
            ref:  "User" 
           },
           time:
           {
            type: Date,
            default:Date.now  
           }
        }
    ]
    

 });

const Post = mongoose.model("Post",PostSchema);
module.exports = Post;
