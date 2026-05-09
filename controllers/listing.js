const listing = require('../collections/listing');

module.exports.listings = async (req,res)=>{
    const data = await listing.find();
    res.render('listings/index.ejs', {data})
}

module.exports.newListingGet = (req,res)=>{
    res.render('listings/new.ejs');
}
module.exports.newListingPost = async (req,res)=>{
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
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const list = await listing.findById(id)
    .populate({path:'reviews',populate:{path:'created_by'}})// use this for nested population of reviews and owner of reviews
    .populate('owner');

    if(!list){
        req.flash('error','Listing not found');
        res.redirect("/listing");
    }
    else{
        res.render('listings/show.ejs',{list}); 
    }
}

module.exports. editListingGet = async (req,res)=>{
    let {id} = req.params;
    const list = await listing.findById(id);
    if(!list){
        req.flash('error','Listing not found');
        res.redirect("/listing");
    }
    else{
        res.render('listings/edit.ejs',{list})
    }
    
}
module.exports.editListingPost = async (req,res)=>{
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
}

module.exports.deleteListing = async (req,res)=>{
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
    
}