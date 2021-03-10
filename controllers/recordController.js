/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const Record = require('../models/record')
const response = require('../helper/response-handle')
const getBookInfo = require('../repository/booksInfo')
const bookIssueValschema = require('../models/bookIssueValSchema')
const stockCheck = require('../repository/stockCheck')
const recordCheck = require('../repository/identicalRecordDocCheck')
const userCheck = require('../repository/userCheckInDb')
const customError = require('../helper/appError')



/**
 * Logic to Issue a book to a User
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const issueBooksByName = async (req, res, next) => {
  try {
    const bookInfo = Object.values(req.body); //Array of values

    const { userId } = req.userData; //from JWT payload
    const userObj = await userCheck.userFindOneById(req.userData.userId);
    const date1 = new Date(userObj.dob);
    const date2 = new Date(Date.now());
    const diffTime = Math.abs(date2 - date1);
    const age = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365))


    let len = Object.keys(req.body).length;
    let bookObjArray = [];
    let bookRejected = [];


    for (let count = 0; count < len; count++) {
      const bookName = bookInfo[count];

      const { error } = bookIssueValschema.validate({ bookName });
      if (error) {
        throw new customError.BadInputError(error.message);
      } else {

        const obj = await getBookInfo.bookInfoByParameter({ $and: [{ bookName }, { isDiscarded: false }] });

        if (obj !== null) {
          bookObjArray.push(obj);

        }

      }
    }
    let len2 = bookObjArray.length;
    let bookObjArray2 = [];
    if (len2 === 0) {
      throw new customError.NotFoundError('No Book Found');
    } else {
      bookRejected = [];
      for (let count = 0; count < len2; count++) {
        const rating = bookObjArray[count].rating;
        if (rating === 'pg' && age < 13) {
          bookRejected.push(bookObjArray[count].bookName);

        } else if (rating === 'r' && age < 17) {
          bookRejected.push(bookObjArray[count].bookName);

        } else {
          bookObjArray2.push(bookObjArray[count]);
        }

      }

    }
    let len3 = bookObjArray2.length;
    let bookObjArray3 = [];
    if (len3 === 0) {
      throw new customError.BadInputError(`Not Appropriate for your Age -${bookRejected}`);
    } else {
      bookRejected = [];
      for (let index = 0; index < len3; index++) {
        const bookId = bookObjArray2[index]._id;
        console.log(bookId, len3);
        const result = await stockCheck(bookId);
        console.log(result);
        if (result) {
          bookObjArray3.push(bookObjArray2[index]);
        }
        else {
          bookRejected.push(bookObjArray2[index].bookName);
        }

      }
    }
    let len4 = bookObjArray3.length;
    let bookObjArray4 = [];
    if (len4 === 0) {
      throw new customError.BadInputError(`Book Out Of Stock-${bookRejected}`);
    } else {
      bookRejected = [];
      for (let index = 0; index < len4; index++) {
        const bookId = bookObjArray3[index]._id;
        const check = await recordCheck.docCheckById(bookId, userId);
        if (check === null) {
          bookObjArray4.push(bookObjArray3[index]);
        } else {
          bookRejected.push(bookObjArray3[index].bookName);

        }

      }

    }
    let len5 = bookObjArray4.length;
    let bookObjArray5 = [];

    if (len5 === 0) {
      throw new customError.BadInputError(`One Book Already Issued- ${bookRejected}`);
    } else {
      for (let index = 0; index < len5; index++) {
        bookObjArray5.push(bookObjArray4[index].bookName);
        const rec = new Record({
          userId,
          bookId: bookObjArray4[index]._id,
          currentPrice: bookObjArray4[index].price,
        })

        await rec.save();

      }

      return res.status(200).json(response(true, null, `Entry Successful, ${bookObjArray5} issued`))
    }
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
    if (req.userData.isAdmin) {
      const count = await recordCheck.docCountByParameter({ userId: req.body.userId });
      if (count === 0) {
        throw new customError.NotFoundError('No Record Exist');
      } else {
        const recordArrayObject = await recordCheck.allRecordInfoByParameter(parseInt(req.params.from), parseInt(req.params.to), { userId: req.body.userId });
        recordArrayObject.push({ numberOfRecords: count })
        res.status(200).json(response(true, recordArrayObject, 'Done!!'));
      }
    } else if (req.body.userId === req.userData.userId) {
      const count = await recordCheck.docCountByParameter({ userId: req.userData.userId });
      if (count === 0) {
        throw new customError.NotFoundError('No Record Exist');
      } else {
        const recordArrayObject = await recordCheck.allRecordInfoByParameter(parseInt(req.params.from), parseInt(req.params.to), { userId: req.userData.userId });
        recordArrayObject.push({ numberOfRecords: count })
        return res.status(200).json(response(true, recordArrayObject, 'Done!!'));
      }
    } else {
      throw new customError.BadInputError('Invalid userId sent');
    }
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
    if (req.userData.isAdmin) {
      const data = await userCheck.userFindOneById(req.body.userId);
      if (data === 0) {
        throw new customError.BadInputError('Invalid userId sent');
      } else {
        const date = new Date(Date.now());
        date.setDate(date.getDate() - req.params.days)

        const recordObj = await recordCheck.priceSumBasedOnUserIdDate(req.body.userId, date);

        if (recordObj.length === 0) {
          res.status(200).json(response(true, null, `No Money Spent in last ${req.params.days} Days `));
        } else {
          res.status(200).json(response(true, recordObj[0].expence, `This Much Money Spent in last ${req.params.days} Days`))
        }
      }
    } else if (req.body.userId === req.userData.userId) {
      const date = new Date(Date.now());
      date.setDate(date.getDate() - req.params.days)

      const recordObj = await recordCheck.priceSumBasedOnUserIdDate(req.body.userId, date);

      if (recordObj.length === 0) {
        res.status(200).json(response(true, null, `No Money Spent in last ${req.params.days} Days `));
      } else {
        res.status(200).json(response(true, recordObj[0].expence, `This Much Money Spent in last ${req.params.days} Days`))
      }
    } else {
      throw new customError.BadInputError('Invalid userId sent');
    }
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
    if (req.userData.isAdmin) {
      const count = await recordCheck.docCountByParameter({ userId: req.body.userId });
      if (count === 0) {
        throw new customError.NotFoundError('No Record Exist');
      } else {
        const recordArrayObject = await recordCheck.allRecordInfoByParameter(parseInt(req.params.from), parseInt(req.params.to), { userId: req.body.userId });
        const booklist = [];
        for (let i = 0; i < req.params.to - req.params.from; i++) {
          const obj = await getBookInfo.bookInfoById(recordArrayObject[i].bookId);

          booklist[i] = obj;
        }
        booklist.push({ numberOfBooks: count })
        res.status(200).json(response(true, booklist, 'Done!!'));
      }
    } else if (req.body.userId === req.userData.userId) {
      const count = await recordCheck.docCountByParameter({ userId: req.userData.userId });
      if (count === 0) {
        throw new customError.NotFoundError('No Record Exist');
      } else {
        const recordArrayObject = await recordCheck.allRecordInfoByParameter(parseInt(req.params.from), parseInt(req.params.to), { userId: req.userData.userId });
        const booklist = [];
        for (let i = 0; i < count; i++) {
          const obj = await getBookInfo.bookInfoById(recordArrayObject[i].bookId);

          booklist[i] = obj;
        }
        booklist.push({ numberOfBooks: count })
        res.status(200).json(response(true, booklist, 'Done!!'));
      }
    } else {
      res.status(200).json(response(false, null, 'Invalid userId sent'));
    }
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
    if (req.userData.isAdmin) {

      const record = await recordCheck.docCheckById(req.body.bookId, req.body.userId);
      if (record === null) {
        throw new customError.NotFoundError('No Such Record Exist');
      } else {
        record.returned = true;
        await record.save()
        return res.status(200).json(response(true, null, 'Book Returned'));

      }
    } else {
      throw new customError.AuthorizationError('Forbidden');
    }
  } catch (err) {
    next(err);
  }
}


module.exports = { issueBooksByName, getBookInfoByUserId, expenceCheck, getBooksRentedByUserId, returnIssuedBook }