const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const userInDb = require('../repository/userCheckInDb')
const recordInDb = require('../repository/identicalRecordDocCheck')
const response = require('../helper/response-handle')
const userValidation = require('../models/loginValJoiSchema')
const customError = require('../helper/appError')


module.exports = {
   /**
   * Logic to Signup with user details
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  signUp: async (req, res, next) => {
    
    try {  
    const users = await userInDb.userFindOne({ $or: [{ email: req.body.email }, { userName: req.body.userName }] })
    if (users != null) {
      //console.log(u2)
      //res.status(400).json(response(false, null, 'Username or Email already exist')) ///Check for Unique Email
      throw new customError.BadInputError('Username or Email already exist');
    } else {
      const user = new User({
        //_id: new Mongoose.Schema.Types.ObjectId,
        name: req.body.name,
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
        //isAdmin: req.body.isAdmin,
        dob: req.body.dob,
      })

      
        //const value = await userValidation.signupValidationSchema.validateAsync(req.body, { abortEarly: false });

        const u1 = await user.save()
          .then(() => { res.status(200).json(response(true, null, 'Welcome!!')) })
          .catch((err) => { throw new customError.BadInputError('Username or Email already exist');
        console.log(err)})
        //console.log(value);

        ///sending wrong input during signup
      
    }
  } catch (error) {
    //res.status(400).json(response(false, null, error.message))
    //console.log(error.message) 
    next(error)                    
  }

    
  },

   /**
   * Logic to Login with checked credentials
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  login: async (req, res, next) => {
    // try {
      //const valu = await userValidation.loginschema.validateAsync(req.body, { abortEarly: false })
      try {
        const user = await userInDb.userFindOne({ userName: req.body.userName })
        //console.log(user);
        if (user===null) {
          throw new customError.NotFoundError('No User with this username found');
        } else {
          
          const match = await bcrypt.compare(req.body.password, user.password); //password encrypted
        
        const newLocal = user._id
        if (match) {
          const token = jwt.sign({
            userId: newLocal,
            isAdmin: user.isAdmin, //JWT creation
          }, process.env.KEY, { expiresIn: '1h' });
          //console.log("logging in")
          //res.headers.token=token;
          return res.status(200).json(response(true, token, 'Authorization Successful'))
        }else{
          //return res.status(401).json(response(false, null, 'Authorization Failed '))
          throw new customError.AuthorizationError('Authorization Failed');

        }
        }
        
       
      } catch (error) { 
        console.log(error)
        //return res.status(401).json(response(false, null, 'Authorization Failed'))
        next(error)
      }
   
  },

   /**
   * Logic to Provide all user data to Admin
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  getAllUsersDetails: async (req, res, next) => {
   
    try {
      if (req.userData.isAdmin) {
        
        const users = await userInDb.userFindAllWithoutId(parseInt(req.params.from),parseInt(req.params.to))
        res.status(200).json(response(true, users, 'Authorized'))
      } else {
        throw new customError.AuthorizationError('Forbidden');
      }
    } catch (err) {
      next(err)
      //res.status(400).json(response(false, null, 'Unauthorized'))
    }
  },

   /**
   * Logic provide or revoke Admin rights
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  controlAdmin: async (req, res) => {
    try {
      if (req.userData.isAdmin) {
        // await userValidation.controlAdminValidation.validateAsync(req.body, {abortEarly: false});
        const user = await userInDb.userFindOne({userName:req.body.userName});
        //console.log(typeof(user))
        //console.log(Object.keys(user).length)
        if(user===null){
          throw new customError.NotFoundError('No User with this username found');
        }else{
          if (user.isAdmin===req.body.isAdmin) {
            throw new customError.BadInputError('Same Status');
          } else {
            user.isAdmin = req.body.isAdmin;

          await user.save()
          .then(() => { res.status(200).json(response(true, null, 'Admin Status Changed')) })
         
          }
          
        }
      } else {
        throw new customError.AuthorizationError('Forbidden');
      }
    } catch (error) {
      //console.log(error)
      //res.status(400).json(response(false, null, error.message))
      next(error);

    }
  }
  

}
