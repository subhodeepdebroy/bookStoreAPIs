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
    const userObj = await userCheck.userFindOneById(req.userData.userId);
    const date1 = new Date(userObj.dob);
    const date2 = new Date(Date.now());
    const diffTime = Math.abs(date2-date1);
    const age = Math.ceil(diffTime/(1000*60*60*24*365))
    //console.log(age+" age");
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
            if (obj.isDiscarded===true) {
              res.status(404).json(response(false, null, 'Cant Issue,Book Discarded'))
            } else {
              if (obj.rating==="pg" && age<13) {
                res.status(400).json(response(false, null, 'Not Appropriate for your Age'));
                break;
                
              } else if(obj.rating==="r" && age<17) {
                res.status(400).json(response(false, null, 'Not Appropriate for your Age'));
                break;
              }else{
                //console.log(obj.rating+" rating");
                const result = await stockCheck(obj._id);
              if (result === false) {
                res.status(400).json(response(false, null, 'Book Out Of Stock'))
                break; ///API 4 in place of null
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
                  break;
                }
              }
  
              }
            }
            
            
            
          }
        }
      } catch (error) {
        console.log(error+" LOL")
        res.status(400).json(response(false, null, 'Bad Request'))
      }

      count += 1
    }
  },
  getBookInfoByUserId: async(req, res) => {
    try {
      if (req.userData.isAdmin) {
        const count = await recordCheck.docCountByParameter({userId:req.body.userId});
        if (count===0) {
          res.status(404).json(response(false, null, 'No Record Exist'));
        } else {
          const recordArrayObject = await recordCheck.allRecordInfoByParameter({userId:req.body.userId});
          recordArrayObject.push({numberOfRecords:count})
          res.status(200).json(response(true, recordArrayObject, 'Done!!'));
        }
  
      } else {
        if (req.body.userId===req.userData.userId) {
          const count = await recordCheck.docCountByParameter({userId:req.userData.userId});
          if (count===0) {
            res.status(404).json(response(false, null, 'No Record Exist'));
          } else {
            const recordArrayObject = await recordCheck.allRecordInfoByParameter({userId:req.userData.userId});
            recordArrayObject.push({numberOfRecords:count})
            res.status(200).json(response(true, recordArrayObject, 'Done!!'));
          }
        } else {
          res.status(200).json(response(false, null, "Invalid userId sent"));
        }
       
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
      res.status(200).json(response(false, null, "Invalid userId sent"));
      console.error(error);
    }
   },
   getBooksRentedByUserId: async(req, res) => {
    try {
      if (req.userData.isAdmin) {
        const count = await recordCheck.docCountByParameter({userId:req.body.userId});
        if (count===0) {
          res.status(404).json(response(false, null, 'No Record Exist'));
        } else {
          const recordArrayObject = await recordCheck.allRecordInfoByParameter({userId:req.body.userId});
          const booklist =[];
          for(let i=0;i<count;i++){
            const obj= await getBookInfo.bookInfoById(recordArrayObject[i].bookId);
            //booklist[i]={bookName:obj.bookName}
            booklist[i]=obj;
          }
          booklist.push({numberOfBooks:count})
          res.status(200).json(response(true, booklist, 'Done!!'));
        }
  
      } else {
        if (req.body.userId===req.userData.userId) {
          const count = await recordCheck.docCountByParameter({userId:req.userData.userId});
          if (count===0) {
            res.status(404).json(response(false, null, 'No Record Exist'));
          } else {
            const recordArrayObject = await recordCheck.allRecordInfoByParameter({userId:req.userData.userId});
            const booklist =[];
            for(let i=0;i<count;i++){
              const obj= await getBookInfo.bookInfoById(recordArrayObject[i].bookId);
              //booklist[i]={bookName:obj.bookName}
              booklist[i]=obj;
            }
            booklist.push({numberOfBooks:count})
            res.status(200).json(response(true, booklist, 'Done!!'));
          }
        } else {
          res.status(200).json(response(false, null, "Invalid userId sent"));
        }
       
      }
    } catch (error) {
      console.log(error)
    }
   },
   returnIssuedBook: async(req, res) => {
    try {
      if (req.userData.isAdmin) {
        //console.log(req.params)
        const record = await recordCheck.docCheckById(req.body.bookId, req.body.userId);
        if (record===null) {
          res.status(404).json(response(false, null, 'No Such Record Found'));
        } else {
          record.returned = true;
          await record.save()
          .then(() => { res.status(200).json(response(true, null, 'Book Returned')) })
          .catch((err) => { res.status(400).json(response(false, null, 'Couldnt Save')) ;
                            console.error(err)})
        }
        //res.status(200).json(response(true, users, 'Authorized'))
      } else {
        res.status(403).json(response(false, null, 'Forbidden'))
      }
    } catch (err) {
      //console.log(err)
      res.status(400).json(response(false, null, 'Unauthorized'))
    }
   }
 

}
