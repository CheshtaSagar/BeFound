
const express = require("express");
const app = express();
const bodyParser= require('body-parser');
const mongoose= require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const nodemailer = require("nodemailer");
const path= require('path');
const session = require('express-session');
const multer=require('multer');
const {GridFsStorage}=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const methodOverride=require('method-override');

// DB Config
const db = require('./config/db').mongoURI;
mongoose.connect(db, {
useNewUrlParser: true, 
useUnifiedTopology: true 
}, err => {
if(err) throw err;
console.log('Connected to MongoDB!!!')
});

// Passport Config
require('./config/passport')(passport);

let gfs;
mongoose.connection.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads"
  });
});


//setting up template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//for getting data from body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Express middleware to connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//for using static files
app.use(express.static('public'));

//image route
app.get("/image/:filename", (req, res) => {

  const file = gfs
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist"
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});


// Connecting Routes
//any request coming will be redirected to routes's auth
app.use("/", require('./routes/index'));
app.use("/profile", require('./routes/profile'));
app.use('/userProfile',require('./routes/userProfile'));
app.use('/upload',require('./routes/upload'));
app.use('/chat',require('./routes/chat'));
app.use('/messages',require('./routes/messages'));
app.use('/recommendations',require('./routes/recommendations'));
app.use('/conversation',require('./routes/conversation'));
app.use('/showProfile',require('./routes/showProfile'));
app.use('/location',require('./routes/location'));
app.use('/post',require('./routes/post'));
app.use('/scheduleDate',require('./routes/scheduleDate'));



//const PORT = process.env.PORT || 5000;

const server = app.listen(5000, () =>
  console.log("Server running on port 5000")
);