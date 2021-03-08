const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Book = require('../models/book')
//const response = require('../helper/response-handle');

module.exports = {
  bookInfoByName: async (bookName) => {
    try {
      const book = await Book.findOne({ bookName });

      return book;
    } catch (error) {
      throw error
    }
  },
  bookInfoById: async (bookId) => {
    try {
      const book = await Book.findOne({ _id: new mongoose.Types.ObjectId(bookId) }, { __v: 0 });

      return book;
    } catch (error) {
      throw error
    }
  },
  bookInfoByParameter: async (parameter) => {
    try {
      const book = await Book.findOne(parameter);
      return book;
    } catch (error) {
      throw error;
    }
  },
  booksInfoByParameter: async (parameter) => {
    try {
      const books = await Book.find(parameter, { _id: 0, __v: 0 });

      return books;
    } catch (error) {
      throw error;
    }
  },
  booksStockSum: async () => {
    try {
      const obj = await Book.aggregate([{ $group: { _id: null, total: { $sum: '$stock' } } }])

      return obj;
    } catch (error) {
      throw error
    }
  },
  bookAllInfoByPagination: async (from, to) => {
    try {
      const books = Book.find({}, { __v: 0 }).skip(from).limit(to - from);
      return books;
    } catch (error) {
      throw error;
    }
  },

}
