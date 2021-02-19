const Book =require('../models/book')
const response = require('../helper/response-handle');
const { ObjectID } = require('mongodb');

module.exports= async(bookName)=>{                         ///REMOVE  req,res
  
    try {
       
        const book= await Book.findOne({bookName});               ///
        //console.log(book)
        return book;
        
    } catch (error) {
        //console.error(error)
        throw error                                         
        //res.status(400).json(response(false,null,"Not Found"))
        
    }
 
     

}

