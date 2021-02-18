const Joi = require('joi');

const bookIssueValschema = Joi.object({
    bookName: Joi.string().lowercase()
                
})

module.exports = bookIssueValschema