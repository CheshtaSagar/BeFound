
const express = require("express");
const app = express();
const bodyParser= require('body-parser');
const mongoose= require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const nodemailer = require("nodemailer");
const path= require('path');
const session = require('express-session');
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

// Connecting Routes
//any request coming will be redirected to routes's auth
app.use("/", require('./routes/index'));

//const PORT = process.env.PORT || 5000;

const server = app.listen(5000, () =>
  console.log("Sever running on port 5000")
);