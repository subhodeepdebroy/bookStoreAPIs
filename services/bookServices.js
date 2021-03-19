const Book = require('../models/book')
const bookVal = require('../models/bookValidationSchema')
const bookQuery = require('../repository/bookQuery')
const recordQuery = require('../repository/recordQuery')
const stockCheckQuery = require('../repository/stockCheckQuery')
const bookIssueValschema = require('../models/bookIssueValidationSchema')
const customError = require('../helper/appError')
const redisQuery = require('../repository/redisQuery')




const bookEntry = async (body, userData) => {
    try {
        if (userData.isAdmin) {
            const parameter = body;
            const bookCheckOutput = await bookQuery.bookInfoByParameter(parameter) //findOne based on all keys
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


const bookCountByGenre = async (params) => {
    try {
        const genreObj = params;
        const count = await bookQuery.bookCountByParameter(genreObj);

        if (count === 0) {
            throw new customError.NotFoundError('Genre Not Found');
        } else {

            return count;
        }
    } catch (error) {
        throw error;
    }

}


const bookCountRemaining = async () => {
    try {
        const stockSumObj = await bookQuery.booksStockSum();
        if (stockSumObj[0].total === 0) {

            return [0, 'No Book in stock'];
        } else {
            const docCountByReturned = await recordQuery.docCountByParameter({ returned: false });
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


const booksRented = async () => {
    try {
        const docCountByRented = await recordQuery.docCountByParameter({ returned: false });
        if (docCountByRented === 0) {

            return [0, 'No Book issued'];
        } else {

            return [docCountByRented, 'Done!!'];
        }
    } catch (error) {
        throw error;
    }
}


const waitForIssue = async (params) => {
    try {
        const bookObj = await bookQuery.bookInfoByName(params.bookName)
        const result = await stockCheckQuery(bookObj._id) //takes bookId and returns true for stock > returned:false and vise versa

        if (result) {

            return [null, 'Book Available for Renting']
        } else {
            const recordObj = await recordQuery.recordOldestIssueDateById(bookObj._id);
            const dateVariable = new Date(recordObj[0].date);

            dateVariable.setDate(dateVariable.getDate() + 14); //Adding 14 to the issue date


            return [dateVariable, 'Could be availed after this date']
        }
    } catch (error) {
        throw error;
    }
}


const booksByAuthor = async (params) => {
    try {

        const member = await redisQuery.scanSortedSets(params.author);

        if (member[0] != '0') {
            throw new customError.NotFoundError('whole list is not read');
        } else {

            if (member[1].length != 0) {
                console.log('Using Cached Data');

                await redisQuery.increaseScoreInSortedSets(member[1][0]);

                return JSON.parse(member[1][0]);

            } else {
                //const bookArrayOfObj = await bookQuery.booksInfoByParameterWithPagination(parseInt(params.from), parseInt(params.to), params);
                //const bookArrayOfObj = await bookQuery.booksInfoByParameterWithPagination(parseInt(params.from), parseInt(params.to), { author: { $regex: params.author, $options: '$i' } });
                const bookArrayOfObj = await bookQuery.booksInfoByParameterWithPagination(parseInt(params.from), parseInt(params.to), { $text: { $search: params.author } });

                const binary = await redisQuery.addToSortedSets(bookArrayOfObj);

                if (binary === 0) {
                    console.log("Sets updated");
                    return;
                } else {
                    if (bookArrayOfObj.length === 0) {
                        throw new customError.NotFoundError('No Book By this Author');
                    } else {
                        return bookArrayOfObj
                    }
                }


            }
        }



    } catch (error) {
        throw error;
    }
}


const patchBooksPrice = async (body, userData) => {
    try {
        if (userData.isAdmin) {
            const book = await bookQuery.bookInfoByParameter({ bookName: body.bookName });
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


const patchBooksGenre = async (body, userData) => {
    try {
        if (userData.isAdmin) {
            const book = await bookQuery.bookInfoByParameter({ bookName: body.bookName });
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


const allbooksDetails = async (params, userData) => {
    try {
        if (userData.isAdmin) {
            const books = await bookQuery.bookAllInfoByPagination(parseInt(params.from), parseInt(params.to));
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


const discardBooks = async (body, userData) => {
    try {
        if (userData.isAdmin) {
            const bookInfo = Object.values(body); // Array of values
            let len = bookInfo.length;
            let bookObjArray = [];
            let bookRejected = [];

            for (let count = 0; count < len; count++) {
                const bookName = bookInfo[count];


                const obj = await bookQuery.bookInfoByParameter({ $and: [{ bookName }, { isDiscarded: false }] })
                if (obj !== null) {
                    bookObjArray.push(obj)

                } else {
                    bookRejected.push(bookInfo[count]);

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


const getBookByName = async (params) => {
    try {
        const book = await bookQuery.bookInfoByParameter(params);

        if (book === null) {
            throw customError.NotFoundError("No book found with this name");
        } else {

            return book;
        }

    } catch (error) {
        throw error;
    }
}


const keywordSearch = async (params) => {
    try {
        const result = await bookQuery.elasticSearchUsingKeyword(params.keyword);

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


const trendingBook = async () => {
    try {

        const result = await redisQuery.rangeOnSortedSets()
        if (result.length === 0) {
            throw new customError.NotFoundError("Key not Found");
        } else {
            const len = result.length;
            let arr = [];
            let arr1 = [];


            for (let i = 0; i < len; i++) {
                if (result[i] === '[]') {
                    continue;
                } else {

                    arr.push(JSON.parse(result[i])[0].author);

                }

            }

            return arr;
        }

    } catch (error) {
        throw error;
    }
}


module.exports = { bookEntry, bookCountByGenre, bookCountRemaining, booksRented, waitForIssue, booksByAuthor, patchBooksPrice, patchBooksGenre, allbooksDetails, discardBooks, getBookByName, keywordSearch, trendingBook }
