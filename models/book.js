
const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');


const bookSchema = new mongoose.Schema({

  bookName: {
    type: String,
    lowercase: true,
    required: true,
    //es_indexed: true,     // ElasticSearch
  },
  price: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    lowercase: true,
    required: true,
  },
  genre: {
    type: String,
    lowercase: true,
    //es_indexed: true,     // ElasticSearch
  },
  dateOfPublish: {
    type: Date,
    default: Date.now,

  },
  stock: {
    type: Number,
    default: 1,
  },
  rating: {
    type: String,
    lowercase: true,
  },
  isDiscarded: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    lowercase: true,
    //es_indexed:true,      // ElasticSearch
  }

})

// bookSchema.plugin(mongoosastic, {
//   "host":"localhost",
//   "port":9200
// })
// bulk:{
//   size:2800,
//   delay:100
// }


bookSchema.index({ author: 'text' })
bookSchema.index({ genre: 1, bookName: 1 })

const Book = mongoose.model('Book', bookSchema);

// Book.createMapping((err, mapping) => {
//   console.log('mapping created');
// });

// const stream = Book.synchronize({}, {saveOnSynchronize: true})



module.exports = Book;
