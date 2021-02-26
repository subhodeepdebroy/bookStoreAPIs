/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const express = require('express')

const router = express.Router()
//const Mongoose = require('mongoose')
const checkAuth = require('../middleware/check-auth')
const recordController = require('../controllers/recordController')

router.post('/', checkAuth, recordController.issueBooksByName)

// API to get renting history of a user by userId

router.get('/userHistory', checkAuth, recordController.getBookInfoByUserId)

//API TO GET EXPENCE OF A USER FOR PAST 'N' DAYS

router.get('/expence/:days', checkAuth ,recordController.expenceCheck);

// API to GET BOOKS AND NO. OF BOOKS RENTED BY UserId

router.get('/books', checkAuth, recordController.getBooksRentedByUserId)

// API to return issued book

router.patch('/return', checkAuth, recordController.returnIssuedBook)

module.exports = router
