const User =require('../models/user-joigoose')
const response = require('../helper/response-handle');
const { ObjectID } = require('mongodb');

module.exports = async(parameter)=>{
    try {
        const user= await User.findOne(parameter);
        return user;
    } catch (error) {
        throw error;
        
    }
}