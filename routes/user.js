const express = require('express');
const route = express.Router();
const asyncwrap = require('../public/javascript/asyncwrap');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {orgUrl} = require('../middlware');
const userController = require('../controllers/user');

// signUp routes
route.route('/signup')
.get(asyncwrap(userController.signUpGet))
.post(asyncwrap(userController.signUpPost))

route.route('/login')
.get(asyncwrap(userController.loginGet))
.post(
    orgUrl, 
    passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),//we can validateuser manually also but here we are using passport.authenticate() method which is inbuilt in passport-local-mongoose package and it will validate the user for us and if there is any error then it will flash the error message and redirect to login page
    asyncwrap(userController.loginPost))

route.get('/logout',userController.logout);


module.exports = route;
