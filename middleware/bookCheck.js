const Book = require('../models/book')
const ress = require('../helper/response-handle')

module.exports = async(req,res,next)=>{
    try {
        const user = await Book.find()
        next()
    } catch (error) {
        res.status(404).json(ress(false,null,"User Not Found"))
        
    }
}