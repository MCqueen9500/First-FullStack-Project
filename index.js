const express = require("express");
const mongoose = require("mongoose");
const path = require('path')
const app = express();
const listing = require('C:/Users/Krushna/OneDrive/Desktop/Project1/First-FullStack-Project/collections/listing');
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")  // help to creates layouts / templates
const asyncwrap = require('./public/javascript/asyncwrap')
const error1 = require("./public/javascript/error")
const {listingSchema} = require('./schema');
const {reviewSchema} = require('./schema');
const reviews = require("./collections/reviews");
const review = require('C:/Users/Krushna/OneDrive/Desktop/Project1/First-FullStack-Project/collections/reviews')

app.use(methodOverride("_method"))
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
main().then(() => console.log("DB Connected"));
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));
app.engine('ejs',ejsMate)

const SchemaValidate = (req,res,next)=>{
    const result = listingSchema.validate(req.body)
    if(result.error){
        throw new error1(500,result.error);
    }
    else{
         next();
    }
}

const SchemaValidate_for_review = (req,res,next)=>{
    const result = reviewSchema.validate(req.body)
    if(result.error){
        throw new error1(500,result.error);
    }
    else{
         next();
    }
}
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/plot_dekho');
}

app.listen(8080,()=>{
    console.log("server connected")
});

app.get("/",(req,res)=>{
    res.send("hello");
});

// listing route which will give all data (lists)
app.get("/listing",asyncwrap(async (req,res)=>{
    const data = await listing.find();
   
    res.render('listings/index.ejs', {data})
    
}))

// new listing add route
app.get('/listing/new',(req,res)=>{
    res.render('listings/new.ejs');
})

app.post("/listing",SchemaValidate,asyncwrap(async (req,res)=>{
    const newListing = new listing(req.body.new);
    await newListing.save().then((res)=>{
        console.log('Added');
    }).catch((err)=>{
        console.log(err);
    })
    res.redirect("/listing")
}))

// show route give info about perticular listing
app.get("/listing/:id",asyncwrap(async (req,res)=>{
    let {id} = req.params;
    const list = await listing.findById(id).populate('reviews');
    
    res.render('listings/show.ejs',{list}); 
    
}))

// edit and Update route

app.get("/listing/:id/edit",asyncwrap(async (req,res)=>{
    let {id} = req.params;
    const list = await listing.findById(id);
    res.render('listings/edit.ejs',{list})
}))

app.put('/listing/:id',SchemaValidate,asyncwrap(async (req,res)=>{
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
   
    res.redirect(`/listing/${id}`)
}))

//review route

app.post('/listing/:id/review',SchemaValidate_for_review,asyncwrap(async (req,res)=>{
    let {id} = req.params;
    let list = await listing.findById(id);
    let rev1 = new review(req.body.review);
    list.reviews.push(rev1);

    await list.save()
    await rev1.save()
    res.redirect(`/listing/${id}`)

}))

// review delete route

app.delete('/listing/:id/reviews/:reviewId',async (req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`)

})

// delete route

app.delete("/listing/:id",asyncwrap(async (req,res)=>{
    let {id} = req.params;
    let deletedList = await listing.findByIdAndDelete(id);
    res.redirect("/listing")
}))

app.use((req, res, next) => {
    next(new error1(404, "Page not found"));
});
app.use((err,req,res,next)=>{
    let {status} = err;
    console.log(err.message);
    res.status(status).render('listings/error.ejs',{err})
}) 