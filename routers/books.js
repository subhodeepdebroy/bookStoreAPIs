/* eslint-disable consistent-return */
const express = require('express')
const router = express.Router()
const checkAuthorization = require('../middleware/check-auth')
const bookController = require('../controllers/bookController')
const checkValidation = require('../middleware/validationCheck')




/** 
 * For Book Entry into DB
 * 
 * @param  {*} '/'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} bookController.bookEntryIntoDb- Control Passed to controller
 */
router.post('/', checkAuthorization, checkValidation.bookEntryValidator, bookController.bookEntryIntoDb);
//, checkAuthorization


/**
 * Get book details of all the books
 * 
 * @param  {*} '/from-:to'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} bookController.allBookDetailsWithPagination- Control Passed to controller
 */
router.get('/:from-:to', checkAuthorization, bookController.allBookDetailsWithPagination)


/**
 * API1 To get count of books by genre
 * 
 * @param  {*} '/count/genre'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} bookController.bookCountByGenre- Control Passed to controller
 */
router.get('/count/:genre', checkAuthorization, bookController.bookCountByGenre);


/**
 * API2 Total number of remaining books in the store
 * 
 * @param  {*} '/count'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} bookController.bookCountRemaining- Control Passed to controller
 */
router.get('/count', checkAuthorization, bookController.bookCountRemaining);


/**
 * API 3 Count number of rented books
 * 
 * @param  {*} '/rented'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} bookController.booksRented- Control Passed to controller
 */
router.get('/rented', checkAuthorization, bookController.booksRented);


/**
 * API 4 Number of days after which a book can be rented
 * 
 * @param  {*} '/waiting/bookName'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} bookController.waitForIssue- Control Passed to controller
 */
router.get('/waiting/:bookName', checkAuthorization, bookController.waitForIssue);


/**
 *  API to find Books by a given author
 * 
 * @param  {*} '/author'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} bookController.booksByAuthor- Control Passed to controller
 */
router.get('/:author/:from-:to', checkAuthorization, bookController.booksByAuthor);


/**
 * PATCH Book Price By bookName
 * 
 * @param  {*} '/changePrice'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} bookController.patchBooksPrice- Control Passed to controller
 */
router.patch('/changePrice', checkAuthorization, checkValidation.bookPricePatchValidator, bookController.patchBooksPrice);


/**
 * PATCH Book Genre By bookName
 * 
 * @param  {*} '/changeGenre'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} bookController.patchBooksGenre- Control Passed to controller
 */
router.patch('/changeGenre', checkAuthorization, checkValidation.bookGenrePatchValidator, bookController.patchBooksGenre);


/**
 *  PATCH isDiscarded to true for deletion
 * 
 * @param  {*} '/delete'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} bookController.discardBooks- Control Passed to controller
 */
router.patch('/delete', checkAuthorization, bookController.discardBooks);

/**
 *  GET book by bookName
 * 
 * @param  {*} '/delete'-EndPoint
 * @param  {*} checkAuthorization- Authentication Checker
 * @param  {*} bookController.discardBooks- Control Passed to controller
 */
router.get('/getBookByName/:bookName', checkAuthorization, bookController.getBookByName);


router.get('/randomSearch/:keyword', checkAuthorization, bookController.keywordSearch);



router.get('/trendingBooks/', checkAuthorization, bookController.trendingBooks);




module.exports = router