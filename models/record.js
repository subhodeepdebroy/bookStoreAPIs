const { ObjectId, ObjectID } = require("mongodb");
const  Mongoose = require("mongoose");

const recordSchema = new Mongoose.Schema({

            bookId: {
                type: Mongoose.ObjectId
                
            },
            userId:{
                type: Mongoose.ObjectId
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

module.export = Mongoose.model('Record',recordSchema)    