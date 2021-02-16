const Joi = require('joi');

const bookValschema = Joi.object({
    bookName: Joi.string()
                .min(3)
                .max(30)
                .required(),

    price: Joi.number()
              .required(),

    author: Joi.string()
              .required(),

    genre: Joi.string(),

    dateOfPublish: Joi.date(),

    stock: Joi.number()          
})

module.exports = bookValschema