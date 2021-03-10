const { ObjectID } = require('mongodb');
const Book = require('../models/book')

const Record = require('../models/record')

const stockChecker = async (bookId) => {
  try {
    const stockObj = await Book.findOne({ _id: bookId }, { stock: 1, _id: 0 });

    const bookObj = await Record.countDocuments({ $and: [{ bookId }, { returned: false }] })

    if (stockObj.stock > bookObj) { //returns true for stock gt issued
      return true
    }
    return false
  } catch (error) {
    throw error;
  }
}

module.exports = { stockChecker }