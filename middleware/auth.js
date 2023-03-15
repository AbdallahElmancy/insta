const jwt = require('jsonwebtoken');
const userModel = require('../DB/user.model');

const auth = (data)=>{
return async(req,res,next)=>{
    let token = req.headers["authorization"]
    if (!token || !token.startsWith("Bearer")) {
        res.status(404).json({massage:"token is invalied"})
    }else{
        let decode = token.split(" ")[1]
        let {id} = jwt.verify(decode, process.env.JWTKEY);
        let user = await userModel.findOne({_id:id}).select("-password")
        if (!user) {
            res.status(500).json({massage:"you can not authanticate beacuse user is not found"})
        }else{
            req.user = user
            if (data.includes(user.role)) {
                next()
            }else{
                res.status(404).json({massage:"you not allow authanticate"})

            }

        }
    }
    
}
}

module.exports = {auth}