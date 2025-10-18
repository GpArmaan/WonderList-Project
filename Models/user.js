const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose); //This will automatically add a password and a username in the schema

module.exports = mongoose.model('User',userSchema);