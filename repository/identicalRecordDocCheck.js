const Book =require('../models/book')
const User =require('../models/user-joigoose')
const Record =require('../models/record')
const response = require('../helper/response-handle');
const { ObjectID } = require('mongodb');

module.exports= async(bookId,userId)=>{
    try {
        const data= await Record.findOne({$and: [{bookId},{userId},{returned:false}]});
       
        return data;

    } catch (error) {
        
        throw error;
    }

}