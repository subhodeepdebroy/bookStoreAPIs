const Joi = require('joi');


const bookIssueValSchema = Joi.array().items(Joi.string().lowercase());


module.exports = bookIssueValSchema
