const Joi = require('joi');

const loginschema = Joi.object({
    userName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

const signupValidationSchema = Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().alphanum().lowercase().min(3).max(30).required(),
    password: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    //isAdmin: Joi.boolean(),
    dob: Joi.date().required()
})

const controlAdminValidation = Joi.object({
    userName: Joi.string().alphanum().lowercase().min(3).max(30).required(),
    isAdmin: Joi.boolean()
})
module.exports = { loginschema, signupValidationSchema, controlAdminValidation }