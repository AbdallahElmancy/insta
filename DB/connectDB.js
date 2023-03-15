const mongoose = require('mongoose');
const connection = ()=>{
    return mongoose.connect(process.env.CONURL).then(()=>{
        console.log("rightconnect");
    }).catch((err)=>{
        console.log(`we have err ${err}`);
    })
}
 module.exports = connection
