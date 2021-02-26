/* eslint-disable consistent-return */
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const User = require('../models/user-joigoose')
//const response = require('../helper/response-handle');

module.exports = {
  userFindOne: async (parameter) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await User.findOne(parameter);
      return user;
    } catch (error) {
      throw error;
    }
  },
  userFindAllWithoutId: async (from,to) => {
    // eslint-disable-next-line no-useless-catch
    try {
      // eslint-disable-next-line no-unused-vars

      const user = await User.find({}, { _id: 0, __v: 0 }).skip(from).limit(to-from)
      return user;
    } catch (error) {
      throw error;
    }
  },
  userFindOneById: async (parameter) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await User.findOne({_id: new mongoose.Types.ObjectId(parameter)});
      return user;
    } catch (error) {
      throw error;
    }
  },
}
