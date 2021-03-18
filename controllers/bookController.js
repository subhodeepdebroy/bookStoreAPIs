const response = require('../helper/response-handle')
const bookServices = require('../services/bookServices')
const { message } = require('../models/bookIssueValSchema')



/**
 * Logic to Enter book data into DB
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const bookEntryIntoDb = async (req, res, next) => {
  try {

    await bookServices.bookEntryService(req.body, req.userData);
    return res.status(200).json(response(true, null, 'Entry Successful'));
  } catch (err) {
    next(err);
  }
}

/**
 * Logic to Count Number of books by Genre
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const bookCountByGenre = async (req, res, next) => {
  try {

    const count = await bookServices.bookCountByGenreService(req.params);
    return res.status(200).json(response(true, count, 'Done!!'));
  } catch (error) {
    next(error);
  }
}

/**
 * Logic to Count total number of books present in the Store
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const bookCountRemaining = async (req, res, next) => {
  try {

    const [result, message] = await bookServices.bookCountRemainingService();
    return res.status(200).json(response(true, result, message));
  } catch (error) {
    next(error);
  }
}

/**
 * Logic to Count number of rented books
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const booksRented = async (req, res, next) => {
  try {

    const [result, message] = await bookServices.booksRentedService();
    return res.status(200).json(response(true, result, message));

  } catch (error) {
    next(error);
  }
}

/**
 * Logic to Find Number of Days after which a book can be issued
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const waitForIssue = async (req, res, next) => {
  try {

    const [result, message] = await bookServices.waitForIssueService(req.params);
    return res.status(200).json(response(true, result, message));
  } catch (error) {
    next(error);
  }
}

/**
 * Logic to Find all the books by a Author
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const booksByAuthor = async (req, res, next) => {
  try {

    const result = await bookServices.booksByAuthorService(req.params);
    return res.status(200).json(response(true, result, 'Done!!'));
  } catch (error) {
    next(error);
  }
}

/**
 * Logic to Patch Price by Name
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const patchBooksPrice = async (req, res, next) => {
  try {

    await bookServices.patchBooksPriceService(req.body, req.userData);
    return res.status(200).json(response(true, null, 'Price Patched'));
  } catch (error) {
    next(error);
  }
}

/**
 * Logic to patch Genre by Name
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const patchBooksGenre = async (req, res, next) => {
  try {

    await bookServices.patchBooksGenreService(req.body, req.userData);
    return res.status(200).json(response(true, null, 'Genre Patched'));

  } catch (error) {
    next(error)
  }
}

/**
 * Logic to Get all books Details
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const allBookDetailsWithPagination = async (req, res, next) => {
  try {

    const result = await bookServices.allbooksDetailsService(req.params, req.userData);
    return res.status(200).json(response(true, result, 'Authorized'));
  } catch (err) {
    next(err);
  }
}

/**
 * Logic to Discard One or many books
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const discardBooks = async (req, res, next) => {
  try {

    await bookServices.discardBooksService(req.body, req.userData);
    return res.status(200).json(response(true, null, 'Discard Successful'));

  } catch (error) {
    next(error);
  }
}

/**
 * Logic to Get a book's details by name
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const getBookByName = async (req, res, next) => {
  try {


    const result = await bookServices.getBookByNameService(req.params);
    return res.status(200).json(response(true, result, 'Done!'));
  } catch (error) {
    next(error);
  }
}

/**
 * Logic to Get a book's details by full text search
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const keywordSearch = async (req, res, next) => {
  try {

    const result = await bookServices.keywordSearchService(req.params);
    return res.status(200).json(response(true, result, 'Done!'))

  } catch (error) {
    next(error);
  }
}


/**
 * Logic to Get top 10 trending books
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const trendingBooks = async (req, res, next) => {
  try {

    const result = await bookServices.trendingBookServices();

    return res.status(200).json(response(true, result, 'Done!'))

  } catch (error) {
    next(error);
  }
}
module.exports = { bookEntryIntoDb, bookCountByGenre, bookCountRemaining, booksRented, waitForIssue, booksByAuthor, patchBooksGenre, patchBooksPrice, allBookDetailsWithPagination, discardBooks, getBookByName, keywordSearch, trendingBooks }