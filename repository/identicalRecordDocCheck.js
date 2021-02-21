const { ObjectID } = require('mongodb');
const Book = require('../models/book')
const User = require('../models/user-joigoose')
const Record = require('../models/record')
const response = require('../helper/response-handle');

module.exports = {
  docCheckById: async (bookId, userId) => {
  try {
    const data = await Record.findOne({ $and: [{ bookId }, { userId }, { returned: false }] });

    return data;
  } catch (error) {
    throw error;
  }
},
  docCountByParameter: async (parameter) => {
    try {
      const count = await Record.countDocuments(parameter)
      //console.log(count)
      return count;
    } catch (error) {
      throw error;
    }
  },
  recordOldestIssueDateById: async (parameter) => {
    try {
      const recordObj = await Record.aggregate([{$match:{$and:[{bookId:parameter},{returned:false}]}},{$group:{_id:null,date:{$min:"$issueDate"}}}]);
      console.log(recordObj);
      return recordObj;
    } catch (error) {
      throw error;
    }
  }
}
