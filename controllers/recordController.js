/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const Record = require('../models/record')
const response = require('../helper/response-handle')
const getBookInfo = require('../repository/booksInfo')
const bookIssueValschema = require('../models/bookIssueValSchema')
const stockCheck = require('../repository/stockCheck')
const recordCheck = require('../repository/identicalRecordDocCheck')
//const recordInDb = require('../repository/identicalRecordDocCheck')
const userCheck= require('../repository/userCheckInDb')

module.exports = {
  issueBooksByName: async (req, res) => {
    const bookInfo = Object.values(req.body); //Array of values

    //const objLength = Object.keys(req.body).length;                        //lenght of body object
    const { userId } = req.userData; //from JWT payload
    let count = 0;
    // eslint-disable-next-line no-restricted-syntax
    // eslint-disable-next-line guard-for-in
    for (const key in req.body) {
      const bookName = bookInfo[count];
      try {
        const { error } = bookIssueValschema.validate({ bookName })
        if (error) {
          res.status(400).json(response(false, null, error.message))
        } else {
          // eslint-disable-next-line no-await-in-loop
          const obj = await getBookInfo.bookInfoByName(bookName) ///CHange getBookInfoByName
          if (obj === null) {
            res.status(404).json(response(false, null, 'Not Found'))
          } else {
            const result = await stockCheck(obj._id);
            if (result === false) {
              res.status(400).json(response(false, null, 'Book Out Of Stock')) ///API 4 in place of null
            } else {
              const check = await recordCheck.docCheckById(obj._id, userId);

              if (check === null) {
                const rec = new Record({
                  userId,
                  bookId: obj._id,
                  currentPrice: obj.price,
                })

                // eslint-disable-next-line no-shadow
                rec.save((error) => { if (error) { throw error } });
                if (count === Object.keys(req.body).length - 1) {
                  res.status(200).json(response(true, null, 'Entry Successful'))
                }
              } else {
                res.status(400).json(response(false, null, 'One book already Issued'))
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
        res.status(400).json(response(false, null, 'Bad Request'))
      }

      count += 1
    }
  },
  getBookInfoByUserId: async(req, res) => {
    try {
      const count = await recordCheck.docCountByParameter({userId:req.userData.userId});
      if (count===0) {
        res.status(404).json(response(false, null, 'No Record Exist'));
      } else {
        const recordArrayObject = await recordCheck.allRecordInfoByParameter({userId:req.userData.userId});
        recordArrayObject.push({numberOfBooks:count})
        res.status(200).json(response(true, recordArrayObject, 'Done!!'));
      }

    } catch (error) {
      console.log(error)
    }
  },
  expenceCheck: async (req, res) => {
    try {
      if (req.userData.isAdmin) {
        const data= await userCheck.userFindOneById(req.body.userId);
        if (data===0) {
          res.status(200).json(response(false, null, "Invalid userId sent"));
        } else {
          const date =new Date( Date.now());
      date.setDate(date.getDate() - req.params.days)
      //console.log(date.toISOString()+" Controller");
      //console.log(req.userData.userId+" Controller");
      //console.log(new Date(date).toISOString());
      const recordObj = await recordCheck.priceSumBasedOnUserIdDate(req.body.userId, date);
      //console.log(recordObj);
      if(recordObj.length===0){
        res.status(200).json(response(true, null, "No Money Spent in last "+req.params.days+" Days "));
      }else{
       res.status(200).json(response(true, recordObj[0].expence, "This Much Money Spent in last "+req.params.days+" Days"))
      }
          
        }
      } else {
        if (req.body.userId===req.userData.userId) {
          const date =new Date( Date.now());
          date.setDate(date.getDate() - req.params.days)
          //console.log(date.toISOString()+" Controller");
          //console.log(req.userData.userId+" Controller");
          //console.log(new Date(date).toISOString());
          const recordObj = await recordCheck.priceSumBasedOnUserIdDate(req.body.userId, date);
          //console.log(recordObj);
          if(recordObj.length===0){
            res.status(200).json(response(true, null, "No Money Spent in last "+req.params.days+" Days "));
          }else{
           res.status(200).json(response(true, recordObj[0].expence, "This Much Money Spent in last "+req.params.days+" Days"))
          }
          
        } else {
          res.status(200).json(response(false, null, "Invalid userId sent"));
          
        }
        
      }
      
 
    } catch(error) {
      console.error(error);
    }
   },
 

}
