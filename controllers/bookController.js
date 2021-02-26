const Book = require('../models/book')
const bookVal = require('../models/bookValSchema')
const response = require('../helper/response-handle')
const bookInDb = require('../repository/booksInfo')
const recordInDb = require('../repository/identicalRecordDocCheck')
const stockCheck = require('../repository/stockCheck')
const bookIssueValschema = require('../models/bookIssueValSchema')



module.exports = {
  bookEntryIntoDb: async (req, res) => {
    try {
      if (req.userData.isAdmin) {
        const parameter = req.body;
        const bookCheckOutput = await bookInDb.bookInfoByParameter(parameter)   //findOne based on all keys
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
            rating: req.body.rating,
            

          })

          await bookVal.bookValschema.validateAsync(req.body, { abortEarly: false }) //Validate Joi Schema

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
      const arrayOfBooks = await bookInDb.booksInfoByParameter(genreObj);   //find based on Genre                      
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
  },
  booksByAuthor: async(req , res) => {
    try {
      //const bookArrayOfObj = await bookInDb.booksInfoByParameter(req.params);
      //const bookArrayOfObj = await bookInDb.booksInfoByParameter({author:{$regex:req.params.author, $options:"$i"}});
      const bookArrayOfObj = await bookInDb.booksInfoByParameter({$text: {$search:req.params.author}});
      if (bookArrayOfObj.length===0) {
        res.status(404).json(response(false, null, "No Book By Author"))
      } else {
        res.status(200).json(response(false, bookArrayOfObj, "Done!!"))
      }
    } catch (error) {
      console.log(error)
      res.status(400).json(response(false, null, "Bad Request"));
    }
  },
  patchBooksPrice: async(req, res) => {
    try {
      if (req.userData.isAdmin) {
         await bookVal.bookPricePatcValschema.validateAsync(req.body, { abortEarly: false });

        const book = await bookInDb.bookInfoByParameter({bookName:req.body.bookName});
        if(Object.keys(book).length===0){
          res.status(400).json(response(false, null, "Book Dosnt exist"))
        }else{
          if (book.genre===req.body.genre) {
            res.status(400).json(response(false, null, 'Same Price'))
          } else {
            book.genre = req.body.genre;
           
  
             await book.save()
            .then(() => { res.status(200).json(response(true, null, 'Price Patched')) })
            .catch((err) => { res.status(400).json(response(false, null, 'Couldnt Save')) ;
                              console.error(err)})
          }
        }
      } else {
        return res.status(403).json(response(false, null, 'Forbidden'));
      }
    } catch (error) {
      res.status(400).json(response(false, null, error.message));
    }
  },
  patchBooksGenre: async(req, res) => {
    try {
      if (req.userData.isAdmin) {
         await bookVal.bookGenrePatchValschema.validateAsync(req.body, { abortEarly: false });

        const book = await bookInDb.bookInfoByParameter({bookName:req.body.bookName});
        if(book===null){
          res.status(400).json(response(false, null, "Book Dosnt exist"))
        }else{if (book.genre===req.body.genre) {
          res.status(400).json(response(false, null, 'Same Genre'))
        } else {
          book.genre = req.body.genre;
         

           await book.save()
          .then(() => { res.status(200).json(response(true, null, 'Genre Patched')) })
          .catch((err) => { res.status(400).json(response(false, null, 'Couldnt Save')) ;
                            console.error(err)})
        }
          
        }
      } else {
        return res.status(403).json(response(false, null, 'Forbidden'));
      }
    } catch (error) {
      res.status(400).json(response(false, null, error.message));
    }
  },
  allBookDetailsWithPagination: async(req,res) => {
    try {
      if (req.userData.isAdmin) {
        //console.log(req.params)
        const books = await bookInDb.bookAllInfoByPagination(parseInt(req.params.from),parseInt(req.params.to));
        //console.log(books)
        res.status(200).json(response(true, books, 'Authorized'))
      } else {
        res.status(403).json(response(false, null, 'Forbidden'))
      }
    } catch (err) {
      //console.log(err)
      res.status(400).json(response(false, null, 'Unauthorized'))
    }
  },
  discardBooks: async(req, res) => {
    try {
      if (req.userData.isAdmin) {
        const bookInfo = Object.values(req.body); // Array of values
        
        let count = 0;
        for(const key in req.body){
          const bookName = bookInfo[count];

          const { error } = bookIssueValschema.validate({ bookName });
          if (error) {
            res.status(400).json(response(false, null, error.message));
          } else {
            const obj = await bookInDb.bookInfoByName(bookName) 
            if (obj === null) {
            res.status(404).json(response(false, null, 'Not Found'))
            } else {
              if (obj.isDiscarded===true) {
                res.status(400).json(response(false, null, 'Book Already Discarded'))
              } else {
                obj.isDiscarded = true;
              await obj.save()
              .then()//() => { res.status(200).json(response(true, null, 'Genre Patched')) })
              .catch((err) => { res.status(400).json(response(false, null, 'Couldnt Save')) ;
                                console.error(err)})
              if (count === Object.keys(req.body).length - 1) {
                        res.status(200).json(response(true, null, 'Discard Successful'))
                    }  
              }
                              
              
            }
            
          }
          count+=1;

        }
      } else {
        res.status(403).json(response(false, null, 'Forbidden'))
      }
    } catch (error) {
      console.log(err)
      res.status(400).json(response(false, null, 'Unauthorized')) 
    }
  }
}
