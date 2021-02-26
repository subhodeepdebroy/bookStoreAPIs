const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const User = require('../models/user-joigoose')
const User = require('../models/user')
const userInDb = require('../repository/userCheckInDb')
const recordInDb = require('../repository/identicalRecordDocCheck')
const response = require('../helper/response-handle')
const userValidation = require('../models/loginValJoiSchema')
//const userInDb = require('../repository/userCheckInDb')

module.exports = {
  signUp: async (req, res) => {
    // eslint-disable-next-line max-len
    const users = await userInDb.userFindOne({ $or: [{ email: req.body.email }, { userName: req.body.userName }] })
    if (users != null) {
      //console.log(u2)
      res.status(400).json(response(false, null, 'Username or Email already exist')) ///Check for Unique Email
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

      try {
        const value = await userValidation.signupValidationSchema.validateAsync(req.body, { abortEarly: false });

        const u1 = await user.save()
          .then(() => { res.status(200).json(response(true, null, 'Welcome!!')) })
          .catch((err) => { res.status(400).json(response(false, null, 'Couldnt Save')) 
        console.log(err)})
        //console.log(value);

        ///sending wrong input during signup
      } catch (error) {
        res.status(400).json(response(false, null, error.message))
        //console.log(error.message)                     /////NEED TO CHECK!!!!!
      }
    }
    // u2=null;
  },
  login: async (req, res) => {
    try {
      const valu = await userValidation.loginschema.validateAsync(req.body, { abortEarly: false })
      try {
        const user = await userInDb.userFindOne({ userName: req.body.userName })
        //console.log(user);
        const match = await bcrypt.compare(req.body.password, user.password); //password encrypted
        // eslint-disable-next-line no-underscore-dangle
        const newLocal = user._id
        if (match) {
          const token = jwt.sign({
            userId: newLocal,
            isAdmin: user.isAdmin, //JWT creation
          }, 'key', { expiresIn: '1h' });
          //console.log("logging in")
          //res.headers.token=token;
          return res.status(200).json(response(true, token, 'Authorization Successful'))
        }else{
          return res.status(401).json(response(false, null, 'Authorization Failed '))

        }
       
      } catch (error) { //wrong Username
        console.log(error)
        return res.status(401).json(response(false, null, 'Authorization Failed'))
      }
    } catch (error) {
      return res.status(400).json(response(false, null, error.message)); //Joi Validation Error
    }
  },
  getAllUsersDetails: async (req, res) => {
    //console.log('Get Request')
    //res.send('Get Request')
    try {
      if (req.userData.isAdmin) {
        //console.log(req.params)
        const users = await userInDb.userFindAllWithoutId(parseInt(req.params.from),parseInt(req.params.to))
        res.status(200).json(response(true, users, 'Authorized'))
      } else {
        res.status(403).json(response(false, null, 'Forbidden'))
      }
    } catch (err) {
      //console.log(err)
      res.status(400).json(response(false, null, 'Unauthorized'))
    }
  },
  controlAdmin: async (req, res) => {
    try {
      if (req.userData.isAdmin) {
        await userValidation.controlAdminValidation.validateAsync(req.body, {abortEarly: false});
        const user = await userInDb.userFindOne({userName:req.body.userName});
        //console.log(typeof(user))
        //console.log(Object.keys(user).length)
        if(user===null){
          res.status(404).json(response(false, null, 'No User with this username found'));
        }else{
          if (user.isAdmin===req.body.isAdmin) {
            res.status(400).json(response(false, null, 'Same Status'))
          } else {
            user.isAdmin = req.body.isAdmin;

          await user.save()
          .then(() => { res.status(200).json(response(true, null, 'Admin Status Changed')) })
          .catch((err) => { res.status(400).json(response(false, null, 'Couldnt Save')) ;
                            console.error(err)})
          }
          
        }
      } else {
        res.status(403).json(response(false, null, 'Forbidden'))
      }
    } catch (error) {
      console.log(error)
      res.status(400).json(response(false, null, error.message))
    }
  }
  

}
