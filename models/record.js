const { ObjectId, ObjectID } = require('mongodb');
//const { string } = require('joi');
const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({

  bookId: {
    type: mongoose.ObjectId,
    required: true,

  },
  userId: {
    type: mongoose.ObjectId,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  returned: {
    type: Boolean,
    default: false,

  },
  currentPrice: {
    type: Number,
  },

})

recordSchema.index({bookId:1, userId:1, issueDate:-1})

module.exports = mongoose.model('Record', recordSchema)
