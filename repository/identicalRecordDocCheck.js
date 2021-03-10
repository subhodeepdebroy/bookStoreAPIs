const { ObjectID } = require('mongodb');
const mongoose = require('mongoose')
const Record = require('../models/record')

// module.exports = {
const docCheckById = async (bookId, userId) => {
  try {
    const data = await Record.findOne({ $and: [{ bookId }, { userId }, { returned: false }] });

    return data;
  } catch (error) {
    throw error;
  }
}
const docCountByParameter = async (parameter) => {
  try {
    const count = await Record.countDocuments(parameter)

    return count;
  } catch (error) {
    throw error;
  }
}
const recordOldestIssueDateById = async (parameter) => {
  try {
    const recordObj = await Record.aggregate([{ $match: { $and: [{ bookId: parameter }, { returned: false }] } }, { $group: { _id: null, date: { $min: '$issueDate' } } }]);

    return recordObj;
  } catch (error) {
    throw error;
  }
}
const allRecordInfoByParameter = async (from, to, parameter) => {
  try {
    const recordArrayObj = await Record.find(parameter, { _id: 0, __v: 0 }).skip(from).limit(to - from);
    return recordArrayObj;
  } catch (error) {
    throw error;
  }
}
const priceSumBasedOnUserIdDate = async (parameter1, parameter2) => {
  try {
    const recordObj = await Record.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(parameter1), issueDate: { $gte: parameter2 } } },
      { $group: { _id: null, expence: { $sum: '$currentPrice' } } },
    ]);

    return recordObj;
  } catch (error) {
    throw error;
  }
}

module.exports = { docCheckById, docCountByParameter, recordOldestIssueDateById, allRecordInfoByParameter, priceSumBasedOnUserIdDate }
