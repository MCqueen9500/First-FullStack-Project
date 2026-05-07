const listing = require('./collections/listing');

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