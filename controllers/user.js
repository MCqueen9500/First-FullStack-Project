const User = require('../collections/user');

module.exports.signUpGet = async (req,res)=>{
    res.render('user/signUp.ejs');
}

module.exports.signUpPost = async (req,res,next)=>{
    let {username,email,password} = req.body;
    let newUser = new User({
        username:username,
        email:email
    })

    let registeredUser = await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash('success','Welcome to trip dekho');
            res.redirect('/listing');
        }
    })
    
}

module.exports.loginGet = async (req,res)=>{
    res.render('user/login.ejs');
}
module.exports.loginPost = async (req,res)=>{
    let url = res.locals.orgUrl || '/listing';
    
    req.flash('success','Welcome back to trip dekho');
    res.redirect(url);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else(
            res.redirect('/listing')
        )
    })
}