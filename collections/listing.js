const { required } = require('joi');
const mongoose = require('mongoose');
const reviews = require('./reviews')
const schema = mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String
    },
    image:{
        url:{
            type:String,
            default:'https://www.travelandleisure.com/thmb/JnzsGGLOaWD626-DtH-m14byvFE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-oeschinensee-PLACESSWITZERLAND1023-e079f30e7792483aa5d7865fad1369b3.jpg'
        },
        filename:{
            type:String
        },
       
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'review'
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

schema.post('findOneAndDelete',async (list)=>{
    if(list){
        await reviews.deleteMany({_id : {$in : list.reviews}})
    }
    
})


const listing = new mongoose.model('listing',schema);

module.exports = listing;