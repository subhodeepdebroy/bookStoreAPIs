const express = require('express')
const router = express.Router()
const Joi =require('joi')
const ress = require('../helper/response-handle')
const Mongoose = require('mongoose')
const record = require('../models/record')
const checkAuth = require('../middleware/check-auth')

//POST 
//Issue Books for User by userName

router.post('/',checkAuth,async(req,res)=>{
    try {
        
    } catch (error) {
        
    }

})
