const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../config/auth");
const isUser = auth.isUser;

router.get('/',isUser, (req, res) => {
    const loggedIn = req.isAuthenticated() ? true : false;
    
    res.render('search', {
        user: req.user,
        loggedIn: loggedIn,
        data:[]
    });
});

router.get('/searchByName',isUser, (req, res) => {
    const searchFields = req.query.userName;
    const loggedIn = req.isAuthenticated() ? true : false;

    User.find({ $or: [{ username: { $regex: searchFields, $options: "$i" } }] })
        .exec(function (err, data) {

            if (err)
                console.log(err);
            else {
                var reqdUsers = [];
                if (data.length > 0)
                    reqdUsers = data;

                res.render('search', {
                    user: req.user,
                    loggedIn: loggedIn,
                    data: reqdUsers,
                });

                console.log(data);
            }

        });

});


router.get('/searchByFilters',isUser, (req, res) => {

    const {gender,lowerLimit,upperLimit,stt,city}=req.query;
    

    console.log(gender +" "+ lowerLimit +" "+ upperLimit +" "+ stt +" "+ city);
    const loggedIn = req.isAuthenticated() ? true : false;
    let location=[city,stt];
    regex = location.join("|");
    var filters={};

    if(gender)
    filters.gender= gender;
    if(lowerLimit && upperLimit)
    filters.age={ $gte: lowerLimit, $lte: upperLimit };
    if(city)
    filters.city= {$regex: regex, $options: "$i"};   
       

    User.find(filters)
        .exec(function (err, data) {

            if (err)
                console.log(err);
            else {
                var reqdUsers = [];
                if (data.length > 0)
                    reqdUsers = data;

                res.render('search', {
                    user: req.user,
                    loggedIn: loggedIn,
                    data: reqdUsers,
                });

                //console.log(data);
            }

        });

});


module.exports = router;
