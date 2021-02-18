const express = require('express')
const router = express.Router()
const Joi =require('joi')
const response = require('../helper/response-handle')
//const Mongoose = require('mongoose')
const Record = require('../models/record')
const checkAuth = require('../middleware/check-auth')
const bookCheck = require('../middleware/bookCheck')
const userCheck = require('../middleware/userCheck')
const getBookInfoByName = require('../repository/booksInfo')
//const bookIssueInputVal = require('../models/bookIssueValSchema')
const bookIssueValschema = require('../models/bookIssueValSchema')
const recordCheck = require('../repository/identicalRecordDocCheck')

router.post('/',checkAuth,async(req,res)=>{
    var bookInfo = Object.values(req.body);                     //Array of values

    //const objLength = Object.keys(req.body).length;           //lenght of body object
    const userId =req.userData.userId;                        //from JWT payload
    var count =0;
    for(key in req.body){
        const bookName= bookInfo[count];
        try {
            const{error,value}= bookIssueValschema.validate({bookName})
                if(error){
                    res.status(400).json(response(false,null,error.message))  
                }
           
            
                
        
                let obj= await getBookInfoByName(bookName)     ///CHange getBookInfoByName
                if (obj===null) {
                                       
                   res.status(404).json(response(false,null,"Not Found"))
                   
                } 
               
                   
                   let check = await recordCheck(obj._id,userId);

                   if (check===null) {
                    const rec = new Record({                            
                        userId: userId,
                        bookId: obj._id,
                        currentPrice: obj.price 
                       })

                     rec.save((error,result)=>{if(error){throw error}});
                     if(count==Object.keys(req.body).length-1){
                        res.status(200).json(response(true,null,"Entry Successful"))  
                     }
                      

                   }else{
                    res.status(400).json(response(false,null,"One book already Issued"))
                   } 
        
                   
               
        } catch (error) {
            
            console.log(error)
        }

       count+=1

   
    

}
})


module.exports = router







