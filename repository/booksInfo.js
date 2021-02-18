const Book =require('../models/book')
const response = require('../helper/response-handle');
const { ObjectID } = require('mongodb');

module.exports= async(req,res,book_name)=>{
   //for(key in req.body.books){
    try {
        //console.log(req.body)
        
        console.log(book_name+" bookInfo")
        const book= await Book.findOne({bookName: book_name});
        console.log(book+" bookinfo")
        if (book===null) {
            throw res.status(404).json(response(false,null,"Not Found"))
            
        } else {
            return book;
            
        }
        
    } catch (error) {
        console.error(error)
        throw res.status(400).json(response(false,null,"Bad Request"))
        
    }
   //}
     

}

