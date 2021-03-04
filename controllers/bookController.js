const Book = require('../models/book')
const bookVal = require('../models/bookValSchema')
const response = require('../helper/response-handle')
const bookInDb = require('../repository/booksInfo')
const recordInDb = require('../repository/identicalRecordDocCheck')
const stockCheck = require('../repository/stockCheck')
const bookIssueValschema = require('../models/bookIssueValSchema')
const customError = require('../helper/appError')



module.exports = {
  
  /**
   * Logic to Enter book data into DB
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  bookEntryIntoDb: async (req, res, next) => {
    try {
      if (req.userData.isAdmin) {
        const parameter = req.body;
        const bookCheckOutput = await bookInDb.bookInfoByParameter(parameter)   //findOne based on all keys
        if (bookCheckOutput != null) {
          throw new customError.BadInputError('Entry already exist'); //Validating for multiple entry
        }
        else {
          const book = new Book({
            bookName: req.body.bookName,
            price: req.body.price,
            author: req.body.author,
            genre: req.body.genre,
            dateOfPublish: req.body.dateOfPublish,
            stock: req.body.stock,
            rating: req.body.rating,
            

          })

          await bookVal.bookValschema.validateAsync(req.body, { abortEarly: false }) //Validate Joi Schema

          await book.save()
            .then(() => { res.status(200).json(response(true, null, 'Entry Successful')) })
            .catch(() => { throw new customError.BadInputError('Couldnt Save'); })
        } 
      } else {
        throw new customError.AuthorizationError('Forbidden');
      }
    } catch (err) {
      //res.status(400).json(response(false, null, 'Unauthorized'))
      next(err);
    }
  },

   /**
   * Logic to Count Number of books by Genre
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  bookCountByGenre: async(req ,res, next) => {
    try {
      //console.log(req.params)
      const genreObj = req.params;
      //console.log(genreObj);
      const arrayOfBooks = await bookInDb.booksInfoByParameter(genreObj);   //find based on Genre                      
      const count = arrayOfBooks.length;
      if (count===0) {
        //res.status(404).json(response(false, null, "Genre Not Found")) 
        throw new customError.NotFoundError('Genre Not Found');
      } else {
        res.status(200).json(response(true, count, "Done!!"));
      }
      
    } catch (error) {
      //console.error(error);
      //res.status(400).json(response(false, null, "Bad Request"));
      next(error);
    }
  },

   /**
   * Logic to Count total number of books present in the Store
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  bookCountRemaining: async(req, res, next) => {
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
      //console.error(error)
      //res.status(400).json(response(false, null, "Bad Request"));
      next(error);
    }
    
    
  },

   /**
   * Logic to Count number of rented books
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  booksRented: async(req, res, next) => {
    
    try {
      const docCountByRented =await recordInDb.docCountByParameter({returned: false});
      if (docCountByRented===0) {
        res.status(200).json(response(true, 0, "No Book issued"))
      } else {
        res.status(200).json(response(true, docCountByRented, "Done!!"));
      }
    } catch (error) {
      //console.error(error);
      //res.status(400).json(response(false, null, "Bad Request"))
      next(error);
    }
  },

   /**
   * Logic to Find Number of Days after which a book can be issued
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  waitForIssue: async(req, res, next) => {
    try {
      //console.log(req.params)
      const bookObj = await bookInDb.bookInfoByName(req.params.bookName)
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
      //console.error(error);
      //res.status(400).json(response(false, null, "Book Dosnt exist"))
      next(error);
    }
  },

   /**
   * Logic to Find all the books by a Author
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  booksByAuthor: async(req , res, next) => {
    try {
      //const bookArrayOfObj = await bookInDb.booksInfoByParameter(req.params);
      //const bookArrayOfObj = await bookInDb.booksInfoByParameter({author:{$regex:req.params.author, $options:"$i"}});
      const bookArrayOfObj = await bookInDb.booksInfoByParameter({$text: {$search:req.params.author}});
      if (bookArrayOfObj.length===0) {
        //res.status(404).json(response(false, null, "No Book By Author"))
        throw new customError.NotFoundError('No Book By this Author');
      } else {
        res.status(200).json(response(false, bookArrayOfObj, "Done!!"))
      }
    } catch (error) {
      //console.log(error)
      //res.status(400).json(response(false, null, "Bad Request"));
      next(error);
    }
  },

   /**
   * Logic to Patch Price by Name
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  patchBooksPrice: async(req, res, next) => {
    try {
      if (req.userData.isAdmin) {
         //await bookVal.bookPricePatcValschema.validateAsync(req.body, { abortEarly: false });

        const book = await bookInDb.bookInfoByParameter({bookName:req.body.bookName});
        if(Object.keys(book).length===0){
          // res.status(400).json(response(false, null, "Book Dosnt exist"))
          throw new customError.NotFoundError('Book Dosnt exist');
        }else{
          if (book.price===req.body.price) {
            //res.status(400).json(response(false, null, 'Same Price'))
            throw new customError.BadInputError('Same Price');
          } else {
            book.price = req.body.price;
           
  
             await book.save()
            .then(() => { res.status(200).json(response(true, null, 'Price Patched')) })
            .catch((err) => { throw new customError.BadInputError('Couldnt Save')
                              })
          }
        }
      } else {
        //return res.status(403).json(response(false, null, 'Forbidden'));
        throw new customError.AuthorizationError('Forbidden');
      }
    } catch (error) {
      //res.status(400).json(response(false, null, error.message));
      next(error);
    }
  },

   /**
   * Logic to patch Genre by Name
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  patchBooksGenre: async(req, res, next) => {
    try {
      if (req.userData.isAdmin) {
         //await bookVal.bookGenrePatchValschema.validateAsync(req.body, { abortEarly: false });

        const book = await bookInDb.bookInfoByParameter({bookName:req.body.bookName});
        if(book===null){
          //res.status(400).json(response(false, null, "Book Dosnt exist"))
          throw new customError.NotFoundError('Book Dosnt exist');
        }else{if (book.genre===req.body.genre) {
          //res.status(400).json(response(false, null, 'Same Genre'));
          throw new customError.BadInputError('Same Genre');
        } else {
          book.genre = req.body.genre;
         

           await book.save()
          .then(() => { res.status(200).json(response(true, null, 'Genre Patched')) })
          .catch((err) => { throw new customError.BadInputError('Couldnt Save') ;
                            })
        }
          
        }
      } else {
        //return res.status(403).json(response(false, null, 'Forbidden'));
        throw new customError.AuthorizationError('Forbidden');
      }
    } catch (error) {
      //res.status(400).json(response(false, null, error.message));
      next(error)
    }
  },

   /**
   * Logic to Get all book's Details  
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  allBookDetailsWithPagination: async(req, res, next) => {
    try {
      if (req.userData.isAdmin) {
        //console.log(req.params)
        const books = await bookInDb.bookAllInfoByPagination(parseInt(req.params.from),parseInt(req.params.to));
        //console.log(books)
        res.status(200).json(response(true, books, 'Authorized'))
      } else {
        // res.status(403).json(response(false, null, 'Forbidden'))
        throw new customError.AuthorizationError('Forbidden');
      }
    } catch (err) {
      //console.log(err)
      //res.status(400).json(response(false, null, 'Unauthorized'))
      next(err);
    }
  },

   /**
   * Logic to Discard One or many books
   * @param  {*} req-Request
   * @param  {*} res-Response
   * @param  {*} next-Passes control to next Middleware
   */
  discardBooks: async(req, res, next) => {
    try {
      if (req.userData.isAdmin) {
        const bookInfo = Object.values(req.body); // Array of values
        
        let count = 0;
        for(const key in req.body){
          const bookName = bookInfo[count];

          const { error } = bookIssueValschema.validate({ bookName });
          if (error) {
            //res.status(400).json(response(false, null, error.message));
            throw new customError.BadInputError(error.message)
          } else {
            const obj = await bookInDb.bookInfoByName(bookName) 
            if (obj === null) {
            //res.status(404).json(response(false, null, 'Not Found'));
            throw new customError.NotFoundError('Book Dosnt exist');
            } else {
              if (obj.isDiscarded===true) {
                //res.status(400).json(response(false, null, 'Book Already Discarded'))
                throw new customError.BadInputError('Book Already Discarded')
              } else {
                obj.isDiscarded = true;
              await obj.save()
              .then()//() => { res.status(200).json(response(true, null, 'Genre Patched')) })
              .catch((err) => { throw new customError.BadInputError('Couldnt Save') ;
                                })
              if (count === Object.keys(req.body).length - 1) {
                        res.status(200).json(response(true, null, 'Discard Successful'))
                    }  
              }
                              
              
            }
            
          }
          count+=1;

        }
      } else {
        //res.status(403).json(response(false, null, 'Forbidden'));
        throw new customError.AuthorizationError('Forbidden');
      }
    } catch (error) {
      //console.log(err)
      //res.status(400).json(response(false, null, 'Unauthorized')) 
      next(error);
    }
  }
}
