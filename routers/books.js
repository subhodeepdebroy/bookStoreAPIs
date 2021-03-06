/* eslint-disable consistent-return */
const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const bookController = require('../controllers/bookController')
const checkValid = require('../middleware/validationCheck')




/** 
 * For Book Entry into DB
 * 
 * @param  {*} '/'-EndPoint
 * @param  {*} checkAuth- Authentication Checker
 * @param  {*} bookController.bookEntryIntoDb- Control Passed to controller
 */
router.post('/',checkAuth ,checkValid.bookEntryValidator, bookController.bookEntryIntoDb);
//, checkAuth


/**
 * Get book details of all the books
 * 
 * @param  {*} '/from-:to'-EndPoint
 * @param  {*} checkAuth- Authentication Checker
 * @param  {*} bookController.allBookDetailsWithPagination- Control Passed to controller
 */
router.get('/:from-:to', checkAuth, bookController.allBookDetailsWithPagination)


/**
 * API1 To get count of books by genre
 * 
 * @param  {*} '/count/genre'-EndPoint
 * @param  {*} checkAuth- Authentication Checker
 * @param  {*} bookController.bookCountByGenre- Control Passed to controller
 */
router.get('/count/:genre', checkAuth, bookController.bookCountByGenre);             


/**
 * API2 Total number of remaining books in the store
 * 
 * @param  {*} '/count'-EndPoint
 * @param  {*} checkAuth- Authentication Checker
 * @param  {*} bookController.bookCountRemaining- Control Passed to controller
 */
router.get('/count', checkAuth, bookController.bookCountRemaining); 


/**
 * API 3 Count number of rented books
 * 
 * @param  {*} '/rented'-EndPoint
 * @param  {*} checkAuth- Authentication Checker
 * @param  {*} bookController.booksRented- Control Passed to controller
 */
router.get('/rented', checkAuth, bookController.booksRented);


/**
 * API 4 Number of days after which a book can be rented
 * 
 * @param  {*} '/waiting/bookName'-EndPoint
 * @param  {*} checkAuth- Authentication Checker
 * @param  {*} bookController.waitForIssue- Control Passed to controller
 */
router.get('/waiting/:bookName', checkAuth, bookController.waitForIssue);


/**
 *  API to find Books by a given author
 * 
 * @param  {*} '/author'-EndPoint
 * @param  {*} checkAuth- Authentication Checker
 * @param  {*} bookController.booksByAuthor- Control Passed to controller
 */
router.get('/:author', checkAuth, bookController.booksByAuthor);


/**
 * PATCH Book Price By bookName
 * 
 * @param  {*} '/changePrice'-EndPoint
 * @param  {*} checkAuth- Authentication Checker
 * @param  {*} bookController.patchBooksPrice- Control Passed to controller
 */
router.patch('/changePrice', checkAuth, checkValid.bookPricePatchValidator, bookController.patchBooksPrice);


/**
 * PATCH Book Genre By bookName
 * 
 * @param  {*} '/changeGenre'-EndPoint
 * @param  {*} checkAuth- Authentication Checker
 * @param  {*} bookController.patchBooksGenre- Control Passed to controller
 */
router.patch('/changeGenre', checkAuth, checkValid.bookGenrePatchValidator, bookController.patchBooksGenre);


/**
 *  PATCH isDiscarded to true for deletion
 * 
 * @param  {*} '/delete'-EndPoint
 * @param  {*} checkAuth- Authentication Checker
 * @param  {*} bookController.discardBooks- Control Passed to controller
 */
router.patch('/delete', checkAuth, bookController.discardBooks);



module.exports = router