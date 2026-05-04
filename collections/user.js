const mongoose = require('mongoose');
const schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;

const UserSchema = new schema({
    email:{
        type:String,
        required:true
    }
})

UserSchema.plugin(passportLocalMongoose);  // it will add username and password field in our schema and also add some methods to our schema

module.exports = mongoose.model('User',UserSchema);