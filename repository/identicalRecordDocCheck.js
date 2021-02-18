const Book =require('../models/book')
const User =require('../models/user-joigoose')
const Record =require('../models/record')
const response = require('../helper/response-handle');
const { ObjectID } = require('mongodb');

module.exports= async(req,res,BookId,UserId)=>{
    try {
        const data= await Record.findOne({$and: [{bookId:BookId},{userId:UserId},{returned:false}]});
        if (data===null) {
            return true;
            
        } else {
             return false;

        }
    } catch (error) {
        res.status(400).json(response(false,null,"Bad Request"))
    }

}