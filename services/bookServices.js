const Book = require('../models/book')
const bookVal = require('../models/bookValSchema')
const response = require('../helper/response-handle')
const bookInDb = require('../repository/booksInfo')
const recordInDb = require('../repository/identicalRecordDocCheck')
const stockCheck = require('../repository/stockCheck')
const bookIssueValschema = require('../models/bookIssueValSchema')
const customError = require('../helper/appError')

const bookEntryService = async (body, userData) => {
    try {
        if (userData.isAdmin) {
            const parameter = body;
            const bookCheckOutput = await bookInDb.bookInfoByParameter(parameter) //findOne based on all keys
            if (bookCheckOutput != null) {
                throw new customError.BadInputError('Entry already exist');
            } else {
                const book = new Book({
                    bookName: body.bookName,
                    price: body.price,
                    author: body.author,
                    genre: body.genre,
                    dateOfPublish: body.dateOfPublish,
                    stock: body.stock,
                    rating: body.rating,
                    description: body.description,

                })



                await book.save()
                console.log('user added in both the databases');

                book.on('es-indexed', (err, result) => {
                    console.log('indexed to elastic search');
                });

                return;
            }
        } else {
            throw new customError.AuthorizationError('Forbidden');
        }
    } catch (error) {
        throw error
    }

}

const bookCountByGenreService = async (params) => {
    try {
        const genreObj = params;
        const count = await bookInDb.bookCountByParameter(genreObj);

        if (count === 0) {
            throw new customError.NotFoundError('Genre Not Found');
        } else {

            return count;
        }
    } catch (error) {
        throw error;
    }

}

const bookCountRemainingService = async () => {
    try {
        const stockSumObj = await bookInDb.booksStockSum();
        if (stockSumObj[0].total === 0) {

            return [0, 'No Book in stock'];
        } else {
            const docCountByReturned = await recordInDb.docCountByParameter({ returned: false });
            if (docCountByReturned === 0) {

                return [stockSumObj[0].total, 'No Book issued'];
            } else {

                return [stockSumObj[0].total - docCountByReturned, 'Done!!'];
            }
        }
    } catch (error) {
        throw error;
    }
}

const booksRentedService = async () => {
    try {
        const docCountByRented = await recordInDb.docCountByParameter({ returned: false });
        if (docCountByRented === 0) {

            return [0, 'No Book issued'];
        } else {

            return [docCountByRented, 'Done!!'];
        }
    } catch (error) {
        throw error;
    }
}

const waitForIssueService = async (params) => {
    try {
        const bookObj = await bookInDb.bookInfoByName(params.bookName)
        const result = await stockCheck(bookObj._id) //takes bookId and returns true for stock > returned:false and vise versa

        if (result) {
            //res.status(200).json(response(true, null, 'Book Available for Renting'))
            return [null, 'Book Available for Renting']
        } else {
            const recordObj = await recordInDb.recordOldestIssueDateById(bookObj._id);
            const dateVariable = new Date(recordObj[0].date);

            dateVariable.setDate(dateVariable.getDate() + 14); //Adding 14 to the issue date

            //res.status(200).json(response(true, dateVariable, 'Could be availed after this date'))
            return [dateVariable, 'Could be availed after this date']
        }
    } catch (error) {
        throw error;
    }
}

const booksByAuthorService = async (params) => {
    try {
        console.log(params);
        //const bookArrayOfObj = await bookInDb.booksInfoByParameterWithPagination(params.from), parseInt(params.to), params);
        const bookArrayOfObj = await bookInDb.booksInfoByParameterWithPagination(parseInt(params.from), parseInt(params.to), { author: { $regex: params.author, $options: '$i' } });
        //const bookArrayOfObj = await bookInDb.booksInfoByParameterWithPagination(params.from), parseInt(params.to),{$text: {$search:params.author}});

        if (bookArrayOfObj.length === 0) {
            throw new customError.NotFoundError('No Book By this Author');
        } else {

            return bookArrayOfObj
        }
    } catch (error) {
        throw error;
    }
}

const patchBooksPriceService = async (body, userData) => {
    try {
        if (userData.isAdmin) {
            const book = await bookInDb.bookInfoByParameter({ bookName: body.bookName });
            if (Object.keys(book).length === 0) {
                throw new customError.NotFoundError('Book Dosnt exist');
            } else if (book.price === body.price) {
                throw new customError.BadInputError('Same Price');
            } else {
                book.price = body.price;

                await book.save()

                return;
            }
        } else {
            throw new customError.AuthorizationError('Forbidden');
        }
    } catch (error) {
        throw error;
    }
}

const patchBooksGenreService = async (body, userData) => {
    try {
        if (userData.isAdmin) {
            const book = await bookInDb.bookInfoByParameter({ bookName: body.bookName });
            if (book === null) {
                throw new customError.NotFoundError('Book Dosnt exist');
            } else if (book.genre === body.genre) {
                throw new customError.BadInputError('Same Genre');
            } else {
                book.genre = body.genre;

                await book.save();

                return;
            }
        } else {
            throw new customError.AuthorizationError('Forbidden');
        }
    } catch (error) {
        throw error;
    }
}

const allbooksDetailsService = async (params, userData) => {
    try {
        if (userData.isAdmin) {
            const books = await bookInDb.bookAllInfoByPagination(parseInt(params.from), parseInt(params.to));
            if (books === null) {
                throw new customError.NotFoundError('No Book Found');

            } else {

                return books;

            }


        } else {
            throw new customError.AuthorizationError('Forbidden');
        }
    } catch (err) {
        throw err;
    }
}

const discardBooksService = async (body, userData) => {
    try {
        if (userData.isAdmin) {
            const bookInfo = Object.values(body); // Array of values
            let len = bookInfo.length;
            let bookObjArray = [];
            let bookRejected = [];

            for (let count = 0; count < len; count++) {
                const bookName = bookInfo[count];

                const { error } = bookIssueValschema.validate({ bookName });
                if (error) {
                    throw new customError.BadInputError(error.message)
                } else {
                    const obj = await bookInDb.bookInfoByParameter({ $and: [{ bookName }, { isDiscarded: false }] })
                    if (obj !== null) {
                        bookObjArray.push(obj)

                    } else {
                        bookRejected.push(bookInfo[count]);

                    }
                }

            }
            let len2 = bookObjArray.length;
            if (len2 === 0) {
                throw new customError.NotFoundError(`Book ${bookRejected} either not for or already discarded`);
            } else {
                for (let index = 0; index < len2; index++) {

                    const obj = bookObjArray[index];
                    obj.isDiscarded = true;
                    await obj.save();

                }

                return;
            }

        } else {
            throw new customError.AuthorizationError('Forbidden');
        }
    } catch (error) {
        throw error;
    }
}

const getBookByNameService = async (params) => {
    try {
        const book = await bookInDb.bookInfoByParameter(params);

        if (book === null) {
            throw customError.NotFoundError("No book found with this name");
        } else {

            return book;
        }

    } catch (error) {
        throw error;
    }
}

const keywordSearchService = async (params) => {
    try {
        const result = await bookInDb.elasticSearchUsingKeyword(params.keyword);

        if (result.length === 0) {
            throw new customError.NotFoundError("Keyword not Found");
        } else {
            console.log(result);

            return result;
        }
    } catch (error) {
        throw error;
    }
}


module.exports = { bookEntryService, bookCountByGenreService, bookCountRemainingService, booksRentedService, waitForIssueService, booksByAuthorService, patchBooksPriceService, patchBooksGenreService, allbooksDetailsService, discardBooksService, getBookByNameService, keywordSearchService }
