const { body } = require('express-validator')


const userValidation = [
    body("userName").isString().optional({checkFalsy: true}),
    body("email").isEmail().withMessage("email is  wrong"),
    body("firstName").isString().optional({checkFalsy: true}),
    body("password").matches(/^[a-zA-Z0-9]{5,30}$/).withMessage("password should strong"),
    body("gender").isString().optional({checkFalsy: true}),
    body("confirmed").isBoolean().optional({checkFalsy: true}),
    body("role").isString().optional({checkFalsy: true}),
    body("profilePic").isString().optional({checkFalsy: true}).withMessage("pic single"),
    body("converPics").isArray().optional({checkFalsy: true}),
    body("flowers").isArray().optional({checkFalsy: true}),
    body('confirmedPassword')
    .exists({checkFalsy: true}).withMessage('You must type a confirmation password')
    .custom((value, {req}) => value === req.body.password).withMessage("The passwords do not match"),

   

]
const singInValidation = [
  body("email").isEmail().withMessage("email is  wrong"),
  body("password").matches(/^[a-zA-Z0-9]{5,30}$/).withMessage("password is wrong")
]
module.exports = {userValidation,singInValidation}