const mongoose = require("mongoose");
const localMongoose= require("passport-local-mongoose")

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
    }
},{timestamps:true})
userSchema.plugin(localMongoose);
const User= mongoose.model("User",userSchema);
module.exports= User;