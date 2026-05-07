const mongoose = require('mongoose');
const schema = mongoose.Schema;
const reviewSchema = new schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('review',reviewSchema)

// it is an one to many relation!!!