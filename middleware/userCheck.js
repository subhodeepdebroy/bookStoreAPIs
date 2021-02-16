const User = require('../models/user-joigoose')
const ress = require('../helper/response-handle')

module.exports = async(req,res,next)=>{
    try {
        const user = await User.findOne()
        next()
    } catch (error) {
        res.status(404).json(ress(false,null,"User Not Found"))
        
    }
}