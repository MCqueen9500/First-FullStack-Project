const listing = require('./collections/listing');
const review = require('./collections/reviews');

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