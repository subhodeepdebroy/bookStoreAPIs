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

    const result = await recordService.issueBookByNameService(req.body, req.userData);
    return res.status(200).json(response(true, null, `Entry Successful, ${result} issued`))

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

    const result = await recordService.getBookIssueInfoByUserIdService(req.body, req.userData, req.params);
    return res.status(200).json(response(true, result, 'Done!!'));
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

    const [result, message] = await recordService.expenceCheckService(req.body, req.userData, req.params);
    return res.status(200).json(response(true, result, message));
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

    const result = await recordService.getBooksRentedByUserIdService(req.body, req.userData, req.params);
    return res.status(200).json(response(true, result, 'Done!!'));
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

    await recordService.returnIssuedBookService(req.body, req.userData);
    return res.status(200).json(response(true, null, 'Book Returned'));

  } catch (err) {
    next(err);
  }
}


module.exports = { issueBooksByName, getBookInfoByUserId, expenceCheck, getBooksRentedByUserId, returnIssuedBook }