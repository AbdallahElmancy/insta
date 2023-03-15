const  router = require('express').Router();
const {signUp,confirmPassword,signIn,updateName,uploadProfilePic,uploadCoverPic,getAllUser} = require("./controller/user.controller")
const {userValidation,singInValidation} = require('./userValidtion')
const handelResult = require("../../middleware/validation")
const {auth} = require("../../middleware/auth");
const endPoints = require('./endPoints');
const multer  = require('multer')


router.post("/user/signup", userValidation,handelResult() ,signUp)
router.post("/user/signin", singInValidation,handelResult() ,signIn)
router.patch("/user/updatename",auth(endPoints.updateName),userValidation[0] ,handelResult() ,updateName)
function fileFilter (req, file, cb) {

   if (file.mimetype == "image/jpeg" || file.mimetype ==  "image/png") {
    cb(null, true)
   }else{
    cb(null, false)
   }  
  }
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+file.originalname)
  }
})
const upload = multer({ storage: storage,fileFilter }) 
router.patch("/user/profilePic",auth(endPoints.updateName),userValidation[7] ,handelResult(),upload.single('avatar'),uploadProfilePic)
router.patch("/user/coverPic",auth(endPoints.updateName),upload.array('avatar'),uploadCoverPic)
router.get("/user/alluser",getAllUser)





router.get("/user/confirmEmail/:token",confirmPassword)


module.exports = router