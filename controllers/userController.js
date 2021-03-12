const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const userInDb = require('../repository/userCheckInDb')
const recordInDb = require('../repository/identicalRecordDocCheck')
const response = require('../helper/response-handle')
const userValidation = require('../models/loginValJoiSchema')
const customError = require('../helper/appError')
const userServices = require('../services/userServices')


  /**
   * Logic to Signup with user details
   * @param  {object} req-Request
   * @param  {object} res-Response
   * @param  {*}      next-Passes control to next Middleware
   */
  const signUp = async (req, res, next) => {
    try {
      // const users = await userInDb.userFindOne({ $or: [{ email: req.body.email }, { userName: req.body.userName }] })
      // if (users != null) {
      //   throw new customError.BadInputError('Username or Email already exist');
      // } else {
      //   const user = new User({
      //   //_id: new Mongoose.Schema.Types.ObjectId,
      //     name: req.body.name,
      //     userName: req.body.userName,
      //     password: req.body.password,
      //     email: req.body.email,
      //     isAdmin: req.body.isAdmin,
      //     dob: req.body.dob,
      //   })

      //     await user.save();
      //     return res.status(200).json(response(true, null, 'Welcome!!'));

      // }
      await userServices.userSignup(req.body);
      return res.status(200).json(response(true, null, 'Welcome!!'));
    } catch (error) {
      next(error)
    }
  }

  /**
   * Logic to Login with checked credentials
   * @param  {object} req-Request
   * @param  {object} res-Response
   * @param  {*}      next-Passes control to next Middleware
   */
  const login = async (req, res, next) => {
    try {
      // const user = await userInDb.userFindOne({ userName: req.body.userName })

      // if (user === null) {
      //   throw new customError.NotFoundError('No User with this username found');
      // } else {
      //   const match = await bcrypt.compare(req.body.password, user.password); //password encrypted

      //   const newLocal = user._id
      //   if (match) {
      //     const token = jwt.sign({
      //       userId: newLocal,
      //       isAdmin: user.isAdmin, //JWT creation
      //     }, process.env.KEY, { expiresIn: '1h' });

      //     req.token = token;

      //     return res.status(200).json(response(true, token, 'Authorization Successful'))
      //   }else{
      //     throw new customError.AuthorizationError('Authorization Failed');

      //   }}
      const token = await userServices.userLogin(req.body);
      req.token = token;
      //console.log(token);
      return res.status(200).json(response(true, token, 'Authorization Successful'));
        
      
    } catch (error) {
      next(error)
    }
  }

  /**
   * Logic to Provide all user data to Admin
   * @param  {object} req-Request
   * @param  {object} res-Response
   * @param  {*}      next-Passes control to next Middleware
   */
  const getAllUsersDetails = async (req, res, next) => {
    try {
      // if (req.userData.isAdmin) {
      //   const users = await userInDb.userFindAllWithoutId(parseInt(req.params.from), parseInt(req.params.to))
      //   res.status(200).json(response(true, users, 'Authorized'))
      // } else {
      //   throw new customError.AuthorizationError('Forbidden');
      // }
     const users = await userServices.userGetDetails(req.params, req.userData);
     return res.status(200).json(response(true, users, 'Authorized'));
    } catch (err) {
      next(err)
    }
  }

  /**
   * Logic provide or revoke Admin rights
   * @param  {object} req-Request
   * @param  {object} res-Response
   * @param  {*}      next-Passes control to next Middleware
   */
  const controlAdmin = async (req, res, next) => {
    try {
      // if (req.userData.isAdmin) {
      //   const user = await userInDb.userFindOne({ userName: req.body.userName });

      //   if (user === null) {
      //     throw new customError.NotFoundError('No User with this username found');
      //   } else if (user.isAdmin === req.body.isAdmin) {
      //     throw new customError.BadInputError('Same Status');
      //   } else {
      //     user.isAdmin = req.body.isAdmin;

      //     await user.save();
      //     return res.status(200).json(response(true, null, 'Admin Status Changed'));
 
      //   }
      // } else {
      //   throw new customError.AuthorizationError('Forbidden');
      // }
      await userServices.userControlAdmin(req.body, req.userData);
      return res.status(200).json(response(true, null, 'Admin Status Changed'));
    } catch (error) {
      next(error);
    }
  }



module.exports = {signUp,login,getAllUsersDetails,controlAdmin}
