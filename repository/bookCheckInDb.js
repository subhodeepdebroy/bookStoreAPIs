const Book =require('../models/book')
const response = require('../helper/response-handle');
const { ObjectID } = require('mongodb');

module.exports = async(parameter)=>{
    try {
        const book= await Book.findOne(parameter);
        return book;
    } catch (error) {
        throw error;
        
    }
}