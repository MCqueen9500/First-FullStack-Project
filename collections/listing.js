const mongoose = require('mongoose');
const schema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String
    },
    image:{
        filename:{
            type:String
        },
        url:{
            type:String,
            default:'https://www.travelandleisure.com/thmb/JnzsGGLOaWD626-DtH-m14byvFE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-oeschinensee-PLACESSWITZERLAND1023-e079f30e7792483aa5d7865fad1369b3.jpg'
        }
        
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:String
})

const listing = new mongoose.model('listing',schema);

module.exports = listing;