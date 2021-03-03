const response = require('../helper/response-handle')
const bookValidation = require('../models/bookValSchema')
const bookIssueValidation = require('../models/bookIssueValSchema')
const userValidation = require('../models/loginValJoiSchema')

const signUpValidator = async(req, res, next) => {
    try {
        const check = await userValidation.signupValidationSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(error);
    }
    

}
const loginValidator = async(req, res, next) => {
    try {
        const check = await userValidation.loginschema.validateAsync(req.body, { abortEarly: false });
        //console.log(check);
        next();
    } catch (error) {
        //console.log(error);
        next(error);
    }
    

}
const controlAdminValidator = async(req, res, next) => {
    try {
        const check = await userValidation.controlAdminValidation.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(error);
    }
    

}


module.exports = {loginValidator, signUpValidator, controlAdminValidator}