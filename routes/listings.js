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


// listing route which will give all data (lists)
route.get("/",asyncwrap(listingController.listings))

// new listing add route
route.get('/new',isLogin,listingController.newListingGet)

route.post("/",SchemaValidate,asyncwrap(listingController.newListingPost))

// show route give info about perticular listing
route.get("/:id",asyncwrap(listingController.showListing))

// edit and Update route

route.get("/:id/edit",isLogin,asyncwrap(listingController.editListingGet))

route.put('/:id',
    isLogin,
    isUser,
    SchemaValidate,
    asyncwrap(listingController.editListingPost))

// delete route

route.delete("/:id",
    isLogin,
    isUser,
    asyncwrap(listingController.deleteListing))

module.exports = route;