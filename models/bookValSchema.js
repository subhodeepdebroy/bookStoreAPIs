const Joi = require('joi');

const bookValschema = Joi.object({
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
})

const bookPricePatcValschema = Joi.object({
  bookName: Joi.string()
    .min(3)
    .max(50)
    .required(),

  price: Joi.number()
    .required(),
})

const bookGenrePatchValschema =  Joi.object({
  bookName: Joi.string()
    .min(3)
    .max(50)
    .required(),

  genre: Joi.string()
    .required(),
})


module.exports = {bookValschema, bookPricePatcValschema, bookGenrePatchValschema}
