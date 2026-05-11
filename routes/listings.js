const express = require('express');
const route = express.Router();
const error1 = require("../public/javascript/error")
const asyncwrap = require('../public/javascript/asyncwrap')
const listing = require('C:/Users/Krushna/OneDrive/Desktop/Project1/First-FullStack-Project/collections/listing');
const path = require('path')
const {reviewSchema} = require('../schema');
const review = require("../collections/reviews");
const {isLogin , isUser ,SchemaValidate} = require('../middlware');
const listingController = require('../controllers/listing');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage});

// listing route which will give all data (lists)
route.route('/')
.get(asyncwrap(listingController.listings))
.post(upload.single('new[file]'),SchemaValidate,asyncwrap(listingController.newListingPost)
)


// new listing add route
route.get('/new',isLogin,listingController.newListingGet)

// show route give info about perticular listing
route.route('/:id')
.get(asyncwrap(listingController.showListing))
.put(
    isLogin,
    isUser,
    upload.single('new[file]'),                                                     
    SchemaValidate,
    asyncwrap(listingController.editListingPost))
.delete(
    isLogin,
    isUser,
    asyncwrap(listingController.deleteListing))

route.get("/:id/edit",isLogin,asyncwrap(listingController.editListingGet))

module.exports = route;