let error1 = require('./error')
function asyncwrap (fn) {
    return (req,res,next) =>{
        fn(req,res,next).catch((err)=>{next(new error1(500,err.message))})
    }
}
module.exports = asyncwrap;