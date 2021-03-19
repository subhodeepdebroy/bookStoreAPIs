//const response = require('../helper/response-handle')
const bookValidation = require('../models/bookValidationSchema')
const bookIssueValidation = require('../models/bookIssueValidationSchema')
const userValidation = require('../models/userValidation')

/**
 * Validator for Sign Up Request
 *
 * @param {*} req-Request
 * @param {*} res-Response
 * @param {*} next-Transfer control to next middleware
 */
const signUpValidator = async (req, res, next) => {
  try {
    const check = await userValidation.signupValidationSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validator For Login Request
 *
 * @param {*} req-Request
 * @param {*} res-Response
 * @param {*} next-Transfer control to next middleware
 */
const loginValidator = async (req, res, next) => {
  try {
    const check = await userValidation.loginschema.validateAsync(req.body, { abortEarly: false });
    //console.log(check);
    next();
  } catch (error) {
    //console.log(error);
    next(error);
  }
}

/**
 * Validator for request to change User status
 *
 * @param {*} req-Request
 * @param {*} res-Response
 * @param {*} next-Transfer control to next middleware
 */
const controlAdminValidator = async (req, res, next) => {
  try {
    const check = await userValidation.controlAdminValidation.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validator for Book Entry
 *
 * @param {*} req-Request
 * @param {*} res-Response
 * @param {*} next-Transfer control to next middleware
 */
const bookEntryValidator = async (req, res, next) => {
  try {
    const check = await bookValidation.bookValidationSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validator for Patch book price
 *
 * @param {*} req-Request
 * @param {*} res-Response
 * @param {*} next-Transfer control to next middleware
 */
const bookPricePatchValidator = async (req, res, next) => {
  try {
    const check = await bookValidation.bookPricePatchValidationSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validator for Patch book Genre
 *
 * @param {*} req-Request
 * @param {*} res-Response
 * @param {*} next-Transfer control to next middleware
 */
const bookGenrePatchValidator = async (req, res, next) => {
  try {
    const check = await bookValidation.bookGenrePatchValidationSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Validator for Book Issuing
 *
 * @param {*} req-Request
 * @param {*} res-Response
 * @param {*} next-Transfer control to next middleware
 */
const bookIssueValidator = async (req, res, next) => {
  try {
    const bookName = Object.values(req.body);

    const check = await bookIssueValidation.validateAsync(bookName, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  loginValidator, signUpValidator, controlAdminValidator, bookEntryValidator, bookPricePatchValidator, bookGenrePatchValidator, bookIssueValidator,
}
