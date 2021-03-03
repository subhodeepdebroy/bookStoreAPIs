/* eslint-disable consistent-return */
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const User = require('../models/user');

//const response = require('../helper/response-handle');

module.exports = {
  userFindOne: async (parameter) => {
   
    try {
      const user = await User.findOne(parameter);
      return user;
    } catch (error) {
      throw error;
    }
  },
  userFindAllWithoutId: async (from,to) => {
   
    try {
    

      //const user = await User.find({}, { _id: 0, __v: 0,password: 0}).skip(from).limit(to-from)    // with pagination
      const user = await User.find({}, { _id: 0, __v: 0,password: 0})                                //without Pagination
      return user;
    } catch (error) {
      throw error;
    }
  },
  userFindOneById: async (parameter) => {
   
    try {
      const user = await User.findOne({_id: new mongoose.Types.ObjectId(parameter)});
      return user;
    } catch (error) {
      throw error;
    }
  },
}
