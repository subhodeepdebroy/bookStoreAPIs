/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const express = require('express')

const router = express.Router()
const response = require('../helper/response-handle')
//const Mongoose = require('mongoose')
const Record = require('../models/record')
const checkAuth = require('../middleware/check-auth')
const getBookInfo = require('../repository/booksInfo')
//const bookIssueInputVal = require('../models/bookIssueValSchema')
const bookIssueValschema = require('../models/bookIssueValSchema')
const recordCheckByIds = require('../repository/identicalRecordDocCheck')
const stockCheck = require('../repository/stockCheck')
const recordController = require('../controllers/recordController')

router.post('/', checkAuth, recordController.issueBooksByName)

module.exports = router
