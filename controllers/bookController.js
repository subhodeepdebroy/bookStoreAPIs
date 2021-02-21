const Book = require('../models/book')
const bookVal = require('../models/bookValSchema')
const response = require('../helper/response-handle')
const bookInDb = require('../repository/booksInfo')
const recordInDb = require('../repository/identicalRecordDocCheck')
const stockCheck = require('../repository/stockCheck')

module.exports = {
  bookEntryIntoDb: async (req, res) => {
    try {
      if (req.userData.isAdmin) {
        const parameter = req.body;
        const bookCheckOutput = await bookInDb.bookInfoByParameter(parameter)
        if (bookCheckOutput != null) {
          return res.status(400).json(response(false, null, 'Entry already Exists!!')) //Validating for multiple entry
        }
        try {
          const book = new Book({
            bookName: req.body.bookName,
            price: req.body.price,
            author: req.body.author,
            genre: req.body.genre,
            dateOfPublish: req.body.dateOfPublish,
            stock: req.body.stock,

          })

          await bookVal.validateAsync(req.body, { abortEarly: false }) //Validate Joi Schema

          await book.save()
            .then(() => { res.status(200).json(response(true, null, 'Entry Successful')) })
            .catch(() => { res.status(400).json(response(false, null, "Couldn't Save")) })
        } catch (error) {
          res.status(400).json(response(false, null, error.message))
        }
      } else {
        return res.status(403).json(response(false, null, 'Forbidden'))
      }
    } catch (err) {
      res.status(400).json(response(false, null, 'Unauthorized'))
    }
  },
  bookCountByGenre: async(req ,res) => {
    try {
      //console.log(req.params)
      const genreObj = req.params;
      //console.log(genreObj);
      const arrayOfBooks = await bookInDb.booksInfoByParameter(genreObj);
      const count = arrayOfBooks.length;
      if (count===0) {
        res.status(404).json(response(false, null, "Genre Not Found")) 
      } else {
        res.status(200).json(response(true, count, "Done!!"));
      }
      
    } catch (error) {
      console.error(error);
      res.status(400).json(response(false, null, "Bad Request"));
    }
  },
  bookCountRemaining: async(req,res) => {
    try {
      const stockSumObj = await bookInDb.booksStockSum();
      if (stockSumObj[0].total===0) {
        res.status(200).json(response(true, 0, "No Book in stock")) 
      } else {
        const docCountByReturned = await recordInDb.docCountByParameter({returned: false});
        if (docCountByReturned===0) {
          res.status(200).json(response(true, stockSumObj[0].total, "No Book issued"))
        } else {
          res.status(200).json(response(true, stockSumObj[0].total-docCountByReturned, "Done!!"));
        }
        
      }
      
    
    } catch (error) {
      console.error(error)
      res.status(400).json(response(false, null, "Bad Request"));
    }
    
    
  },
  booksRented: async(req,res) => {
    
    try {
      const docCountByRented =await recordInDb.docCountByParameter({returned: false});
      if (docCountByRented===0) {
        res.status(200).json(response(true, 0, "No Book issued"))
      } else {
        res.status(200).json(response(true, docCountByRented, "Done!!"));
      }
    } catch (error) {
      console.error(error);
      res.status(400).json(response(false, null, "Bad Request"))
    }
  },
  waitForIssue: async(req, res) => {
    try {
      //console.log(req.params)
      const bookObj = await bookInDb.bookInfoByName(req.params)
      const userId = req.userData.userId;
      const result = await stockCheck(bookObj._id)   //takes bookId and returns true for stock < returned:false and vise versa
      //console.log(bookObj._id)     
      if (result===true) {
        res.status(200).json(response(true, null, "Book Available for Renting"))
      } else {
        const recordObj = await recordInDb.recordOldestIssueDateById(bookObj._id);
        const date = new Date(recordObj[0].date);
        //console.log(date);
        date.setDate(date.getDate() + 14);        //Adding 14 to the issue date
        //console.log(date);
        res.status(200).json(response(true, date, "Could be availed after this date"))
      }               
    } catch (error) {
      console.error(error);
      res.status(400).json(response(false, null, "Book Dosnt exist"))
    }
  }
}
