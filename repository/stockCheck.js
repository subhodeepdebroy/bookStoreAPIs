const Book =require('../models/book')
//const User =require('../models/user')
const Record =require('../models/record')
//const response = require('../helper/response-handle');
const { ObjectID } = require('mongodb');

module.exports= async(bookId)=>{
    try {
        const stockObj = await Book.findOne({_id:bookId},{stock:1,_id:0});
        //console.log(stockObj)
        
        const bookObj = await Record.countDocuments({$and:[{bookId},{returned:false}]})
        //console.log(bookObj)
        if(stockObj.stock > bookObj){               //returns true for stock gt issued
            return true
        }else{
            return false
        }

    } catch (error) {
        
        throw error;
    }

}