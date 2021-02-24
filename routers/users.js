/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const express = require('express')
//const user = require('../models/user')
const router = express.Router()
//const {userValSchema}= require('../middleware/validation_schema')
const User = require('../models/user-joigoose')
const checkAuth = require('../middleware/check-auth')
const response = require('../helper/response-handle')
//const { schema } = require('../models/user-joigoose')

const userInDb = require('../repository/userCheckInDb')
const userController = require('../controllers/userController')

//GET
//Get Whole

router.get('/', checkAuth, userController.getAllUsersDetails)

//Get By Id

router.get('/:id', async (req, res) => {
  try {
    res.status(200).json({ message: 'Auth Successful' })
  } catch (err) {
    res.status(404).json({ message: 'Not found!!' })
  }
})

// SignUp

router.post('/signup', userController.signUp);

// Login

router.post('/login', userController.login);


//PATCH
//Patch book_rented By Id

router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    user.book_rented = req.body.book_rented
    const u1 = await user.save()
    res.json(u1)
  } catch (err) {
    res.send('Error cant update')
  }
})

//DELETE
//Delete By Id

router.delete('/:id', checkAuth, async (req, res) => {
  try {
    //console.log(req.userData)
    if (req.userData.isAdmin) {
      res.status(200).json({
        success: true,
        payload: {
          data: null,
          token: null,
        },
        status: {
          code: 200,
          message: 'OK -User Deleted',
        },

      })
    } else {
      res.status(403).json({
        success: false,
        payload: {
          data: null,
          token: null,
        },
        status: {
          code: 403,
          message: 'Forbidden- Not a Admin',
        },

      })
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      payload: {
        data: null,
        token: null,
      },
      status: {
        code: 404,
        message: 'Cant Delete',
      },

    })
  }
})

module.exports = router
