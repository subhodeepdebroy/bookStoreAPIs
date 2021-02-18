//to Check that username sent is valid
const User = require('../models/user-joigoose')
const ress = require('../helper/response-handle')

module.exports = async(req,res,next)=>{
    try {
        const user = await User.findOne({userName:req.body.userName})
        //console.log(user)
        if (user!=null) {
            req.userId = user._id;
            console.log(req.userId)
            next()
            
        } else {
            return res.status(404).json(ress(false,null,"User not found"))
            
        }
        
    } catch (error) {
        return res.status(400).json(ress(false,null,"Bad Request user"))
        
    }
}