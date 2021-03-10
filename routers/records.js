/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const recordController = require('../controllers/recordController')
const checkValid = require('../middleware/validationCheck')

//

router.post('/', checkAuth, recordController.issueBooksByName);

// API to get renting history of a user by userId

router.get('/userHistory/:from-:to', checkAuth, recordController.getBookInfoByUserId);

//API TO GET EXPENCE OF A USER FOR PAST 'N' DAYS

router.get('/expence/:days', checkAuth ,recordController.expenceCheck);

//  API to GET BOOKS AND NO. OF BOOKS RENTED BY UserId

router.get('/books/:from-:to', checkAuth, recordController.getBooksRentedByUserId);

// API to return issued book

router.patch('/return', checkAuth, recordController.returnIssuedBook);


module.exports = router
