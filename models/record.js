const { ObjectId, ObjectID } = require("mongodb");
const { string } = require("joi");
const  mongoose = require("mongoose");

const recordSchema =  new mongoose.Schema({

            bookId: {
                type: mongoose.ObjectId
            },
            userId:{
                type: mongoose.ObjectId
            },
            issueDate:{
                type: Date,
                default: Date.now
            },
            returned:{
                type: Boolean,
                default: false
    
            },
            currentPrice:{ 
                    type: Number
            }
        
    })

module.exports = mongoose.model('Record',recordSchema)