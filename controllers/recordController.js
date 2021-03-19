/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const response = require('../helper/response-handle')
const recordService = require('../services/recordServices')



/**
 * Logic to Issue a book to a User
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const issueBooksByName = async (req, res, next) => {
  try {

    const result = await recordService.issueBookByName(req.body, req.userData);
    return response(true, null, `Entry Successful, ${result} issued`, res)

  } catch (error) {
    next(error);
  }

}

/**
 * Logic to get Renting History of a user By userId
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const getBookInfoByUserId = async (req, res, next) => {
  try {

    const result = await recordService.getBookIssueInfoByUserId(req.body, req.userData, req.params);
    return response(true, result, 'Done!!', res);
  } catch (error) {
    next(error);
  }
}

/**
 * Logic to Check the Expenditure of a user in last 'N' days
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const expenceCheck = async (req, res, next) => {
  try {

    const [result, message] = await recordService.expenceCheck(req.body, req.userData, req.params);
    return response(true, result, message, res);
  } catch (error) {
    next(error)
  }
}

/**
 * Logic to Get Books And Number Of books rented , by userID
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const getBooksRentedByUserId = async (req, res, next) => {
  try {

    const result = await recordService.getBooksRentedByUserId(req.body, req.userData, req.params);
    return response(true, result, 'Done!!', res);
  } catch (error) {
    next(error);
  }
}

/**
 * Logic To Return a issued Book
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const returnIssuedBook = async (req, res, next) => {
  try {

    await recordService.returnIssuedBook(req.body, req.userData);
    return response(true, null, 'Book Returned', res);

  } catch (err) {
    next(err);
  }
}


module.exports = { issueBooksByName, getBookInfoByUserId, expenceCheck, getBooksRentedByUserId, returnIssuedBook }