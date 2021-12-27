const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //for storing encrypted password
const passport = require("passport");
const auth = require('../config/auth');
const User = require("../models/User");
const async = require('async');
const crypto = require("crypto"); //to generate file names
const isUser=auth.isUser;


//forget password route
router.get('/',function(req,res){
    res.render('forgetPassword',{
      user:req.user
    });
  });


 
 //for forget password token generation and sending mail on the required email id
router.post('/', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {      //will generate random string which will act as a token
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email:req.body.email}, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgetPassword');
          }
  
          user.resetToken = token;
          user.tokenExpires = Date.now() + 7200000; // valid for 2 hours
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
      
        async function main() {
        
          let testAccount = await nodemailer.createTestAccount();
        
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            service: 'gmail',
           auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
           }
          });
        
  
         
          // send mail with defined transport object
            let info =await transporter.sendMail({
            from:'"Be Found"<infinityjobs3@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: "Password Reset" , // Subject line
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/forgetPassword/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          });
        
        
          if(info.messageId)
          {
          console.log('Mail sent');
          req.flash('success_msg', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
          res.redirect('/forgetPassword');
          }
        console.log("Message sent: %s", info.messageId);
        }
        
        main().catch(console.error);
       
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgetPassword');
    });
  });
  
  
//once the user clicks on the link given in email,he will be redirected here
router.get('/reset/:token', function(req, res) {
    User.findOne({ resetToken: req.params.token, tokenExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        res.redirect('/forgetPassword');
      }
      res.render('resetPassword',{  'user': req.user });
       
        //redirecting user to setting new password page
    });
});
    



//to set new password 
router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetToken: req.params.token, tokenExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');//to check token is valid or not
            return res.redirect('back');
          }
  
          const {password,password2}=req.body;
  
          user.resetToken = undefined;  //once token has been used,initialize it to undefined again
          user.tokenExpires = undefined;
  
          if (!password || !password2) {
            errors.push({ msg: "Please enter all fields" });
          }
        
          if (password != password2) {
            errors.push({ msg: "Passwords do not match" });
          }
        
          if (password.length < 5) {
            errors.push({ msg: "Password must be at least 5 characters" });
          }
        
  
          bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hash
            user.password = hash;
        
            user
              .save()
              .then((user) => {
                console.log('password updated');
                res.redirect("/login");
              })
          })
          );
        });
      }
      ], function(err) {
      res.redirect('/');
    }
    
    );
  });
    

module.exports = router;