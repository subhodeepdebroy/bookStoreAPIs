const Joi = require('joi');

const bookValidationSchema = Joi.object({
  bookName: Joi.string()
    .min(3)
    .max(50)
    .required(),

  price: Joi.number()
    .required(),

  author: Joi.string()
    .required(),

  genre: Joi.string(),

  dateOfPublish: Joi.date(),

  stock: Joi.number(),

  rating: Joi.string().pattern(new RegExp("(G|PG|R)","i")),
   
  isDiscarded: Joi.boolean(),

  description: Joi.string(),
})

const bookPricePatchValidationSchema = Joi.object({
  bookName: Joi.string()
    .min(3)
    .max(50)
    .required(),

  price: Joi.number()
    .required(),
})

const bookGenrePatchValidationSchema =  Joi.object({
  bookName: Joi.string()
    .min(3)
    .max(50)
    .required(),

  genre: Joi.string()
    .required(),
})


module.exports = {bookValidationSchema, bookPricePatchValidationSchema, bookGenrePatchValidationSchema}
