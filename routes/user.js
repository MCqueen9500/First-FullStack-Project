const express = require('express');
const route = express.Router();
const User = require('../collections/user');
const asyncwrap = require('../public/javascript/asyncwrap');
const passport = require('passport');
const error1 = require("../public/javascript/error")
const LocalStrategy = require('passport-local');

// signUp routes

route.get("/signup",asyncwrap(async (req,res)=>{
    res.render('user/signUp.ejs');
}));

route.post('/signup',asyncwrap(async (req,res)=>{
    let {username,email,password} = req.body;
    let newUser = new User({
        username:username,
        email:email
    })

    let registeredUser = await User.register(newUser,password);
    req.flash('success','Welcome to trip dekho');
    res.redirect('/listing');
}))


route.get("/login",asyncwrap(async (req,res)=>{
    res.render('user/login.ejs');
}));



route.post('/login',
    passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),//we can validateuser manually also but here we are using passport.authenticate() method which is inbuilt in passport-local-mongoose package and it will validate the user for us and if there is any error then it will flash the error message and redirect to login page
    asyncwrap(async (req,res)=>{
    req.flash('success','Welcome back to trip dekho');
    res.redirect('/listing');
}));


module.exports = route;
