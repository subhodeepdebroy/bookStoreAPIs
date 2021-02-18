const express = require('express')
const router = express.Router()
const Joi =require('joi')
const response = require('../helper/response-handle')
//const Mongoose = require('mongoose')
const Record = require('../models/record')
const checkAuth = require('../middleware/check-auth')
const bookCheck = require('../middleware/bookCheck')
const userCheck = require('../middleware/userCheck')
const bookServices = require('../repository/booksInfo')
const bookIssueInputVal = require('../models/bookIssueValSchema')
const bookIssueValschema = require('../models/bookIssueValSchema')
const recordCheck = require('../repository/identicalRecordDocCheck')

router.post('/',checkAuth,async(req,res)=>{
    var bookInfo = Object.values(req.body);                     //Array of values

    //const objLength = Object.keys(req.body).length;           //lenght of body object
    const userId =req.userData.userId;                        //from JWT payload
    var count =0;
    for(key in req.body){
        const book_name= bookInfo[count];
        try {
            await bookIssueValschema.validateAsync({bookName: book_name})
        
            try {
                
                
        
                var obj= await bookServices(req,res,book_name)
                //console.log(userId);
                //console.log(obj._id)
                //console.log(obj.price)
              
              
               try {
                
                   //console.log(rec)
                   var check = await recordCheck(req,res,obj._id,userId);
                   if (check===true) {
                    const rec = new Record({                            //ERROR!!!!!
                        userId: userId,
                        bookId: obj._id,
                        currentPrice: obj.price 
                       })
                     rec.save((err,result)=>{if(err){console.log(err)}});
                     if(count==Object.keys(req.body).length-1){
                        res.status(200).json(response(true,null,"Entry Successful"))  
                     }
                      

                   }else{
                    res.status(400).json(response(false,null,"One book already Issued"))
                   } 
        
                   
                   //res.status(200).json(response(true,null,"Entry Successful")) 
               } catch (error) {
                   console.error(error)
                   res.status(400).json(response(false,null,"Couldnt Save"))
               }
        
                             
            } catch (error) {
                console.error(error)
               res.status(400).json(response(false,null,"Bad Request"))
               
           }
        } catch (error) {
            res.status(400).json(response(false,null,error.message)) 
        }

       count+=1
    }
   
    

})

// {bookId:book._id,
//     currentPrice:book.price}


//POST 
//Issue Books for User by userName

// router.post('/',checkAuth,userCheck,bookCheck,async(req,res)=>{
//    try {
       
//        console.log(req.info);
//        if (req.userData.isAdmin) {
//            var x=[]
//            x=Object.keys(req.body.books)
//         for(var k=0;k<req.count;k++){
//             try {
//                 //const y=x[k];
//                 console.log("WORKING!!")
//                 //console.log(req.book1.id)
//                 console.log(req.info[k].id)
              
                
//                 try {
//                 const rec = new Record({
//                     bookId:req.info[k].id,
//                     userId:req.userId,
//                     currentPrice:req.info[k].price 
//                 })
                
//                     await rec.save()
//                     res.status(200).json(ress(true,null,"Entry Successful")) 
//                 } catch (error) {
                     
//                     console.error(error)
                    
//                 }
//                  //NEED SOME WORK
                
                
//             } catch (error) {
            
//                 console.error("LOL"+error)
                
//             }
//         }
           
//        } else {
//         return res.status(403).json(ress(false,null,"Forbidden"))
//        }
//    } catch (error) {
//        console.error(error)
//     res.status(400).json(ress(false,null,"Unauthorized"))
//    }

// })

module.exports = router







