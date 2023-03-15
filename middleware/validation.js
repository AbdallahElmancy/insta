const {   validationResult} = require('express-validator')
const {
	StatusCodes,
} = require('http-status-codes');

const handelResult = ()=>{
    return (req,res,next)=>{
        const validationResults = validationResult(req)
        if (validationResults.isEmpty()) {
            next()
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({massage:"ther is error in validation",errors:validationResults})
        }
    }
}
// other way
  //   (req, res, next) => {
  //   const error = validationResult(req).formatWith(({ msg }) => msg);

  //   const hasError = !error.isEmpty();

  //   if (hasError) {
  //     res.status(422).json({ error: error.array() });
  //   } else {
  //     next();
  //   }
  // }, 

module.exports = handelResult

