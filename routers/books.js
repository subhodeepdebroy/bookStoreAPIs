/* eslint-disable consistent-return */
const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')
const bookController = require('../controllers/bookController')



// For Book Entry into DB

router.post('/', checkAuth, bookController.bookEntryIntoDb);

//Get book details of all the books

router.get('/:from-:to', checkAuth, bookController.allBookDetailsWithPagination)

// API1 To get count of books by genre

router.get('/count/:genre', checkAuth, bookController.bookCountByGenre);             

//API2 Total number of remaining books in the store

router.get('/count', checkAuth, bookController.bookCountRemaining); 

//API 3 Count number of rented books

router.get('/rented', checkAuth, bookController.booksRented);

// API 4 Number of days after which a book can be rented

router.get('/waiting/:bookName', checkAuth, bookController.waitForIssue);

// API 5 & 6 Books by a given author

router.get('/:author', checkAuth, bookController.booksByAuthor);

//PATCH Book Price By bookName

router.patch('/changePrice', checkAuth, bookController.patchBooksPrice);

//PATCH Book Genre By bookName

router.patch('/changeGenre', checkAuth, bookController.patchBooksGenre);

// PATCH isDiscarded to true for deletion

router.patch('/delete', checkAuth, bookController.discardBooks);



module.exports = router
