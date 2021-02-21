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

module.exports = router
