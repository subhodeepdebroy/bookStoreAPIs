const Joi = require('joi')
const mongoose = require("mongoose");
const Joigoose = require("joigoose")(mongoose);
//const bcrypt = require('bcrypt')
const ress = require('../helper/response-handle')

const bookSchema = new mongoose.Schema({

    
        bookName: {
            type: String,
            lowercase:true,
            required: true
        },
        price: {
            type: Number,
            required: true 
        },
        author: {
            type: String,
            lowercase:true,
            required: true
        },
        genre: {
            type: String,
            lowercase:true
        },
        dateOfPublish: {
            type: Date,
            default: Date.now
            
        },
        stock: {
             type: Number,
             default: 1   
        }
   


})

module.exports = mongoose.model('Book',bookSchema)