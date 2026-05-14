const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const path = require('path')
const app = express();
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")  // help to creates layouts / templates
const asyncwrap = require('./public/javascript/asyncwrap')
const error1 = require("./public/javascript/error")
const listings = require('./routes/listings')
const reviews =  require('./routes/reviews')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./collections/user');
const users = require('./routes/user');
const multer = require('multer');

const store = new MongoStore({
    mongoUrl:process.env.MONGO_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600
})

store.on("error",()=>{
    console.log('error occurs');
})

const sessionOptions = {
    store:store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}
app.use(session(sessionOptions));
app.use(flash());
//******************************** passport configuration**********************************************/
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/******************************************************************************************************/
app.use(methodOverride("_method"))
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));
app.engine('ejs',ejsMate)


app.use((req,res,next)=>{
        res.locals.successMsg = req.flash('success');
        res.locals.failureMsg = req.flash('error');
        res.locals.loginUser = req.user;
    next();
})

app.get('/',(req,res)=>{
    res.redirect('/listing');
});
//******************************* all listing routes in one line  ** using express.Routes ********************************************
app.use('/listing',listings);
/*********************************Sign up and login Routes **************************************************************************************** */
app.use(users);
//************************************all reviews routes*************************************** */
app.use('/listing/:id/review',reviews);

app.use((req, res, next) => {
    next(new error1(404, "Page not found"));  
});

app.use((err,req,res,next)=>{
    let {status = 500} = err;
    console.log(status);
    res.status(status).render('listings/error.ejs', { err });
});

async function main(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected");
        app.listen(8080,()=>{
            console.log("server connected on port 8080");
        });
    } catch (err) {
        console.error("DB Connection Error:", err.message);
        process.exit(1);
    }
}

main();


