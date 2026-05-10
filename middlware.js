const listing = require('./collections/listing');
const review = require('./collections/reviews');
const {listingSchema , reviewSchema} = require('./schema');
const error1 = require('./public/javascript/error')

module.exports.isLogin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You are not logged in');
        console.log(req.originalUrl);
        req.session.url = req.originalUrl;
        res.redirect('/login');
    }
    else{
        next();
    }
}

module.exports.orgUrl = (req,res,next)=>{
    if(req.session.url){
        res.locals.orgUrl = req.session.url;
    }
    next();
}

module.exports.isUser = async (req,res,next)=>{
    let {id} = req.params;
    let list = await listing.findById(id);
    if(!list.owner.equals(req.user._id)){
        req.flash('error','You are not the ownwer of the listing');
        res.redirect(`/listing/${id}`);
    }
    else{
        next();
    }
}

module.exports.isReviewUser = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let rev = await review.findById(reviewId);
    if(!rev.created_by.equals(req.user._id)){
        req.flash('error','You cannot delete this review');
        res.redirect(`/listing/${id}`);
    }
    else{
        next();
    }
}

module.exports.SchemaValidate = (req,res,next)=>{
    const result = listingSchema.validate(req.body)
    if(result.error){
        throw new error1(500,result.error);
    }
    else{
         next();
    }
}

module.exports.SchemaValidate_for_review = (req,res,next)=>{
    const result = reviewSchema.validate(req.body)
    if(result.error){
        throw new error1(500,result.error);
    }
    else{
         next();
    }
}