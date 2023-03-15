const userModel = require("../../../DB/user.model") 
const sendEmail = require("../../../common/email")
const jwt = require('jsonwebtoken');
const becrypt = require('bcrypt');



const {
	StatusCodes,
	getReasonPhrase,
} = require('http-status-codes');

const signUp = async(req,res)=>{
   try {
      let {email,password} = req.body
      let emailFound = await userModel.findOne({email})
      if (emailFound) {
         res.status(StatusCodes.BAD_REQUEST).json({massage:"email is aready found",statusErr:getReasonPhrase(StatusCodes.BAD_REQUEST)})
      }else{
             let addUser = new userModel({email,password})
             let saveUser = await addUser.save()
             let token = jwt.sign({id:addUser._id},process.env.JWTKEY,{expiresIn:"2 days"})
             const massage = `<a href='${req.protocol}://${req.headers.host}/user/confirmEmail/${token}'>hello</a>`
         
             let pathAttachmentPdf =     {
               filename:"invoice.pdf",
               path:"invoice.pdf",
               contentType:"application/pdf"
             }
             sendEmail(email,massage,pathAttachmentPdf)
             res.status(StatusCodes.ACCEPTED).json({massage:"succes add",saveUser}) 
      }
   } catch (error) {
      res.status(StatusCodes.BAD_GATEWAY).json({massage:"the serverr error",statusErr:getReasonPhrase(StatusCodes.BAD_GATEWAY)})

   }
}
const confirmPassword = async (req,res)=>{
try {
   let {token} = req.params
   const isconfirm = true 
   let {id} = jwt.verify(token, process.env.JWTKEY);
   const findUser = await userModel.findOne({_id:id},{})
   if (findUser) {
      if (findUser.confirmed) {
         res.status(StatusCodes.BAD_REQUEST).json({massage:"email was confirmed before "})

      }else{
         let updateUser = await userModel.findOneAndUpdate({_id:id},{confirmed:isconfirm})
         res.status(StatusCodes.ACCEPTED).json({massage:"email is confirmed",updateUser})
      }
   }else{
      res.status(StatusCodes.BAD_REQUEST).json({massage:"the email is not exist"})

   }

} catch (error) {
   res.status(StatusCodes.BAD_GATEWAY).json({massage:"the serverr error",error,statusErr:getReasonPhrase(StatusCodes.BAD_GATEWAY)})
}


}

const signIn = async(req,res)=>{
try {
   let {email, password}=req.body
   let user = await userModel.findOne({email})
   if(user){
      becrypt.compare(password,user.password,function (err,result){
         if (result) {
            let token = jwt.sign({id:user._id,isLogin:true},process.env.JWTKEY)

            res.status(StatusCodes.ACCEPTED).json({massage:"welcome",token})
         }else{
            res.status(StatusCodes.BAD_REQUEST).json({massage:"password is wrong"})
         }
      })
   }else{
      res.status(StatusCodes.BAD_REQUEST).json({massage:"user is not found"})
   }
} catch (error) {
   res.status(StatusCodes.BAD_GATEWAY).json({massage:"the serverr error",error,statusErr:getReasonPhrase(StatusCodes.BAD_GATEWAY)})

}
}
const updateName =async(req,res)=>{
try {
   let {userName} = req.body
   let foundUser = await userModel.findByIdAndUpdate({_id:req.user._id},{userName},{new:true}).select("-password")
      res.status(StatusCodes.ACCEPTED).json({massage:"user is update",foundUser})
} catch (error) {
   res.status(StatusCodes.BAD_GATEWAY).json({massage:"the serverr error",error,statusErr:getReasonPhrase(StatusCodes.BAD_GATEWAY)})

}
}
const uploadProfilePic = async (req,res)=>{
   try {
      if (!req.file) {
         res.status(StatusCodes.BAD_REQUEST).json({massage:"invalied image"})
      }else{
   
         const imageURL =`${req.protocol}://${req.headers.host}/${req.file.path}`
         const updateUser = await userModel.findByIdAndUpdate(req.user._id,{profilePic:imageURL},{new:true})
         res.status(202).json({massage:"succes updated",updateUser})
      }
   } catch (error) {
      res.status(StatusCodes.BAD_GATEWAY).json({massage:"the serverr error",error,statusErr:getReasonPhrase(StatusCodes.BAD_GATEWAY)})

   }

}
const uploadCoverPic = async (req,res)=>{
   try {
      if (req.files.lenght == 0 || !req.files) {
         res.status(StatusCodes.BAD_REQUEST).json({massage:"invalied image"})
      }else{
         let allPics = []
         for (let index = 0; index < req.files.length; index++) {
            let imageURL =`${req.protocol}://${req.headers.host}/${req.files[index].path}`
            allPics.push(imageURL)
         }
         let updateUser = await userModel.findByIdAndUpdate(req.user._id,{coverPics:allPics },{new:true})
         res.status(202).json({massage:"succes updated",updateUser})
      }
   } catch (error) {
      res.status(StatusCodes.BAD_GATEWAY).json({massage:"the serverr error",error,statusErr:getReasonPhrase(StatusCodes.BAD_GATEWAY)})

   }

}

const getAllUser = async (req,res)=>{
   try {
      let {page,limit} = req.query
      if(!page || page <= 0 ){
         page=1
      }
      if(!limit || limit <= 0 ){
         limit = 4
      }
      let skipItem = (page-1)*limit
      let alluser = await userModel.find({}).select("-password").limit(limit).skip(skipItem)
      res.status(StatusCodes.ACCEPTED).json({massage:"allUser",alluser})
   } catch (error) {
      res.status(StatusCodes.BAD_GATEWAY).json({massage:"the serverr error",error,statusErr:getReasonPhrase(StatusCodes.BAD_GATEWAY)})
   }
}

module.exports = {signUp,confirmPassword,signIn,updateName,uploadProfilePic,uploadCoverPic,getAllUser}