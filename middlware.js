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