const express = require('express');
const route = express.Router({mergeParams: true});
const error1 = require("../public/javascript/error")
const asyncwrap = require('../public/javascript/asyncwrap')
const listing = require('C:/Users/Krushna/OneDrive/Desktop/Project1/First-FullStack-Project/collections/listing');
const path = require('path')
const {reviewSchema} = require('../schema');
const review = require("../collections/reviews");
const {isLogin,isUser,isReviewUser} = require('../middlware');

const SchemaValidate_for_review = (req,res,next)=>{
    const result = reviewSchema.validate(req.body)
    if(result.error){
        throw new error1(500,result.error);
    }
    else{
         next();
    }
}

//review route

route.post('/',isLogin,
    SchemaValidate_for_review,
    asyncwrap(async (req,res)=>{
    let {id} = req.params;
    let list = await listing.findById(id);
    let rev1 = await new review(req.body.review);
    rev1.created_by = req.user._id;
    list.reviews.push(rev1);
    await list.save()
    await rev1.save()
    res.redirect(`/listing/${id}`)

}))

// review delete route

route.delete('/:reviewId',isLogin,isReviewUser,asyncwrap(async (req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`)
}))

module.exports = route;