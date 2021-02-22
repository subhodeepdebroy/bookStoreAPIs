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

// API 7 GET BOOKS AND NO. OF BOOKS RENTED BY UserId

router.get('/info', checkAuth, recordController.getBookInfoByUserId)

module.exports = router
