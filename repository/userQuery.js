/* eslint-disable consistent-return */
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const User = require('../models/user');


  const userFindOne = async (parameter) => {
    try {
      const user = await User.findOne(parameter);
      return user;
    } catch (error) {
      throw error;
    }
  }
  const userFindAllWithoutId = async (from, to) => {
    try {
      const user = await User.find({}, { _id: 0, __v: 0,password: 0}).skip(from).limit(to-from)    // with pagination
      //const user = await User.find({}, { _id: 0, __v: 0, password: 0 }) //without Pagination
      return user;
    } catch (error) {
      throw error;
    }
  }
  const userFindOneById = async (parameter) => {
    try {
      const user = await User.findOne({ _id: new mongoose.Types.ObjectId(parameter) });
      //console.log(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

module.exports = {userFindOne, userFindAllWithoutId, userFindOneById}
