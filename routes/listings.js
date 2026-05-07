const express = require('express');
const route = express.Router();
const {listingSchema} = require('../schema');
const error1 = require("../public/javascript/error")
const asyncwrap = require('../public/javascript/asyncwrap')
const listing = require('C:/Users/Krushna/OneDrive/Desktop/Project1/First-FullStack-Project/collections/listing');
const path = require('path')
const {reviewSchema} = require('../schema');
const review = require("../collections/reviews");
const {isLogin , isUser} = require('../middlware');


const SchemaValidate = (req,res,next)=>{
    const result = listingSchema.validate(req.body)
    if(result.error){
        throw new error1(500,result.error);
    }
    else{
         next();
    }
}


//************************************************* all listing  **************************************************************************************************
// listing route which will give all data (lists)
route.get("/",asyncwrap(async (req,res)=>{
    const data = await listing.find();
    res.render('listings/index.ejs', {data})
    
}))

// new listing add route
route.get('/new',isLogin,(req,res)=>{
    res.render('listings/new.ejs');
})

route.post("/",SchemaValidate,asyncwrap(async (req,res)=>{
    const newListing = new listing(req.body.new);
    newListing.owner = req.user._id;
    console.log(newListing);
    await newListing.save().then((res)=>{
        console.log('Added');
    }).catch((err)=>{
        console.log(err);
    })
    req.flash('success','Listing added successfully');
    res.redirect("/listing")
}))

// show route give info about perticular listing
route.get("/:id",asyncwrap(async (req,res)=>{
    let {id} = req.params;
    const list = await listing.findById(id).populate('reviews').populate('owner');
    console.log(list);
    if(!list){
        req.flash('error','Listing not found');
        res.redirect("/listing");
    }
    else{
        res.render('listings/show.ejs',{list}); 
    }
    
    
}))

// edit and Update route

route.get("/:id/edit",isLogin,asyncwrap(async (req,res)=>{
    let {id} = req.params;
    const list = await listing.findById(id);
    if(!list){
        req.flash('error','Listing not found');
        res.redirect("/listing");
    }
    else{
        res.render('listings/edit.ejs',{list})
    }
    
}))

route.put('/:id',
    isLogin,
    isUser,
    SchemaValidate,asyncwrap(async (req,res)=>{
    let list = await req.body.new;
    let {id} = req.params;
    let obj = {
        title: list.title,
        description: list.description,
        image: {
                filename: "listingimage",
                url: list.image,
               },
        price: list.price,
        location: list.location,
        country: list.country,
     }
    await listing.findByIdAndUpdate(id,obj).then((res)=>{
        console.log("success");
    }).catch((err)=>{
        console.log(err);
    })
    req.flash('success','Listing updated successfully');
    res.redirect(`/listing/${id}`)
}))

// delete route

route.delete("/:id",isLogin,asyncwrap(async (req,res)=>{
    let {id} = req.params;
    let deletedList = await listing.findByIdAndDelete(id);
    if(!deletedList){
        req.flash('error','Listing not found');
        res.redirect("/listing");
    }
    else{
        req.flash('success','Listing deleted successfully');
        res.redirect("/listing")
    }
    
}))

module.exports = route;