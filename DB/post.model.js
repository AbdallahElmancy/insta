const mongoose = require('mongoose');
const replySchema = new mongoose.Schema({
    desc:String,
    images:Array,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    tags:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}],
    isDelete:{type:Boolean,default:false},
    deletedAt:String,
    deletedBy:{type:mongoose.Schema.Types.ObjectId,ref:"user"}
},{
    timestamps:true
})
const commentSchema = new mongoose.Schema({
    desc:String,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    images:Array,
    tags:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}],
    reply:[replySchema],
    isDelete:{type:Boolean,default:false},
    deletedAt:String,
    deletedBy:{type:mongoose.Schema.Types.ObjectId,ref:"user"}

},{
    timestamps:true
})
const postSchema = new mongoose.Schema({
    desc:String,
    title:String,
    images:Array,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    tags:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}],
    comments:[commentSchema],
    isBlocked:{type:Boolean,default:false}
},{
    timestamps:true
})


const postModel = mongoose.model('post',postSchema)

module.exports = postModel