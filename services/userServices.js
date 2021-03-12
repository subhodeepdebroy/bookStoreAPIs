const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
//const userInDb = require('../')
const userInDb = require('../repository/userCheckInDb')
const recordInDb = require('../repository/identicalRecordDocCheck')
const response = require('../helper/response-handle')
const userValidation = require('../models/loginValJoiSchema')
const customError = require('../helper/appError')


const userSignup = async (obj)=>{
    try {
        const users = await userInDb.userFindOne({ $or: [{ email: obj.email }, { userName: obj.userName }] })
        if (users != null) {
          throw new customError.BadInputError('Username or Email already exist');
        } else {
          const user = new User({
          //_id: new Mongoose.Schema.Types.ObjectId,
            name: obj.name,
            userName: obj.userName,
            password: obj.password,
            email: obj.email,
            isAdmin: obj.isAdmin,
            dob: obj.dob,
          })
    
            await user.save();
            return ;
    
        }
        
    } catch (error) {
        throw error;
    }


}


module.exports = {userSignup}