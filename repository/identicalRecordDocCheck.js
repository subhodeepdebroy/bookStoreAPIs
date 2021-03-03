const { ObjectID } = require('mongodb');
const Book = require('../models/book')
const User = require('../models/user')
const Record = require('../models/record')
const response = require('../helper/response-handle');
const mongoose = require('mongoose')

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
      //console.log(recordObj);
      return recordObj;
    } catch (error) {
      throw error;
    }
  },
  allRecordInfoByParameter: async (parameter) => {
    try {
      const recordArrayObj = await Record.find(parameter,{ _id: 0, __v: 0 });
      return recordArrayObj;
    } catch (error) {
      throw error;
    };
  },  
  priceSumBasedOnUserIdDate: async (parameter1,parameter2) => {
    try {
      //console.log(parameter1,parameter2+ " Repo");

      const recordObj = await Record.aggregate([
        {$match:{userId:new mongoose.Types.ObjectId(parameter1), issueDate : {$gte : parameter2}}},
        {$group:{_id:null,expence:{$sum:"$currentPrice"}}}
      ]);
      //const recordObj = await Record.aggregate([{$match:{parameter1,parameter2},$group:{_id:null,expence:{$sum:"$currentPrice"}}}]);
      //console.log(recordObj);
      return recordObj;
    } catch (error) {
      throw error;
    }
  }
  
}
