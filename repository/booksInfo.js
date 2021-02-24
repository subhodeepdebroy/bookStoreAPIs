const { ObjectID } = require('mongodb');
const Book = require('../models/book')
const response = require('../helper/response-handle');
const mongoose= require('mongoose');

module.exports = {
  bookInfoByName: async (bookName) => {
  // eslint-disable-next-line no-useless-catch
    try {
      const book = await Book.findOne({bookName});
      //console.log(book)
      return book;
    } catch (error) {
    //console.error(error)
      throw error
    //res.status(400).json(response(false,null,"Not Found"))
    }
  },
  bookInfoById: async (bookId) =>{
    try {
      const book = await Book.findOne({_id: new mongoose.Types.ObjectId(bookId)});
      console.log(book);
      return book;
    } catch (error) {
    
      throw error
    
    }

  },
  bookInfoByParameter: async (parameter) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const book = await Book.findOne(parameter);
      return book;
    } catch (error) {
      throw error;
    }
  },
  booksInfoByParameter: async (parameter) => {
    //console.log(parameter + "parameter")
    try {
      const books = await Book.find(parameter,{ _id: 0, __v: 0 });
      //console.log(books)
      return books;
    } catch (error) {
      throw error;
    }
  },
  booksStockSum: async() => {
      try {
        const obj = await Book.aggregate([{ $group:{ _id: null, total: {$sum:"$stock"}}}])
        //console.log(obj);
        return obj;
      } catch (error) {
        throw error
      }    
  }

}
