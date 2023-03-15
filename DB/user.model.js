const mongoose = require('mongoose');
const becrypt = require('bcrypt');
const saltRound = process.env.SALTROUND
const userSchema = new mongoose.Schema({
    userName:String,
    email:{type:String,required:true},
    firstName:String,
    password:{type:String,required:true},
    gender:{type:String,default:"male"},
    confirmed:{type:Boolean,default:false},
    role:{type:String,default:"user"},
    profilePic:String,
    coverPics:Array,
    flowers:Array
})
userSchema.pre('save',function(next){
    this.password = becrypt.hashSync(this.password,parseInt(saltRound))
    next()
} )

const userModel = mongoose.model('user',userSchema)

module.exports = userModel