const express = require("express");
const mongoose = require("mongoose");
const path = require('path')
const app = express();
const listing = require('C:/Users/Krushna/OneDrive/Desktop/Project1/First-FullStack-Project/collections/listing');
const methodOverride = require("method-override")
app.use(methodOverride("_method"))
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
main().then(() => console.log("DB Connected"));
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));


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
app.get("/listing",async (req,res)=>{
    const data = await listing.find();
   
    res.render('index.ejs', {data})
    
})

// new listing add route
app.get('/listing/new',(req,res)=>{
    res.render('new.ejs');
})

app.post("/listing",async (req,res)=>{
    const newListing = new listing(req.body.new);
    await newListing.save().then((res)=>{
        console.log('Added');
    }).catch((err)=>{
        console.log(err);
    })
    res.redirect("/listing")
})

// show route give info about perticular listing
app.get("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    const list = await listing.findById(id);
    
    res.render('show.ejs',{list}); 
    
})

// edit and Update route

app.get("/listing/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const list = await listing.findById(id);
    res.render('edit.ejs',{list})
})

app.put('/listing/:id',async (req,res)=>{
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
})

// delete route

app.delete("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    let deletedList = await listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listing")
})