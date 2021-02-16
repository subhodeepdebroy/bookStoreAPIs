const express = require('express')
const { Mongoose } = require('mongoose')
//const user = require('../models/user')
const router = express.Router()
const User = require('../models/user-joigoose')
const Joi = require('joi')
//const {userValSchema}= require('../middleware/validation_schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
const ress = require('../helper/response-handle')
//const { schema } = require('../models/user-joigoose')

const login = require('../models/loginValJoiSchema')

//GET
//Get Whole

router.get('/',checkAuth,async(req,res)=>{
    //console.log('Get Request')
    //res.send('Get Request')
    try{
        if (req.userData.isAdmin) {

             const users= await User.find({} ,{_id:0,__v:0})
             return res.status(200).json(ress(true,users,"Authorized"))                    
            
        } else {
            return res.status(403).json(ress(false,null,"Forbidden"))
        }
    }catch(err){
        res.status(400).json(ress(false,null,"Unauthorized")
    )
        
    }
})

//Get By Id

router.get('/:id',async(req,res)=>{
    
    try{
        
        const user= await User.findById(req.params.id,{user_name: 1})
        res.status(200).json({message: "Auth Successful"})

    }catch(err){
        res.status(404).json({message: "Not found!!"})
    }
})

//POST
router.post('/signup', async(req,res)=>{
             
    const u2 = await User.findOne({$or: [{email:req.body.email},{userName:req.body.userName}]})                    //
    if(u2!=null){          
        //console.log(u2)                                                  
         res.status(400).json(ress(false,null,"Username or Email already exist"))      ///Check for Unique Email
    }else{
        
           


        const user = new User({
            //_id: new Mongoose.Schema.Types.ObjectId,
            name: req.body.name,
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email,
            isAdmin: req.body.isAdmin
            })


            try {
                
              

                const value = await user.validate(req.body,{ abortEarly:false });
                try {
                    const u1 = await user.save()
                    //console.log(value);
                    res.status(200).json(ress(true,null,"Welcome!!"))
                }
                catch (err) {                              ///sending wrong input during signup
                    res.status(400).json(ress(false,null,"Couldnt Save"))
                }
            } catch (error) {
                   res.status(400).json(ress(false,null,error.message))    
                //console.log(error.message)                     /////NEED TO CHECK!!!!!
                
            }
        }
           // u2=null;
             
})
////

router.post('/login', async(req,res)=>{

    //  login= {
    //     userName:req.body.userName,
    //     password:req.body.password

    // }

    try {
        const valu =await login.validateAsync(req.body,{abortEarly:false})
        try {
            const user = await User.findOne({userName:req.body.userName})
            //console.log(user);
            const match = await bcrypt.compare(req.body.password,user.password);   //password encrypted   
                 
            if(match)
            {
             const token=jwt.sign({
                 userId:user._id,
                 isAdmin:user.isAdmin                      //JWT creation
               },'key', { expiresIn: '1h' });
                //console.log("logging in")
                //res.headers.token=token;
                return res.status(200).json(
                 ress(true,token,"Authorization Successful")
             )
         
            }else{
         
                  res.status(401).json(ress(false,null,"Authorization Failed")) //wrong Password
             
            }
           } catch (err) {                          //wrong Username
               return res.status(401).json(ress(false,null,"Authorization Failed"))
        }
    } catch (error) {

        res.status(400).json(ress(false,null,error.message)) ;  //Joi Validation Error
        
    }
})
/////
    

   
 

//PATCH
//Patch book_rented By Id

router.patch('/:id',async(req,res)=>{
    try{
         const user = await User.findById(req.params.id)
         user.book_rented = req.body.book_rented
         const u1 = await user.save()
         res.json(u1)

    }catch(err){
        res.send('Error cant update')
    }
})

//DELETE
//Delete By Id

router.delete('/:id',checkAuth, async(req,res)=>{
    try{
        //console.log(req.userData)
        if(req.userData.isAdmin){
            const user = await User.remove({_id:req.params.id})
            res.status(200).json({
                success: true,
                payload:{  data:null,
                           token:null
                           },
                status: {
                  code: 200,
                  message: "OK -User Deleted"
                }
              
    
            })
         

        }else{
                res.status(403).json({
                success: false,
                payload:{  data:null,
                           token:null
                           },
                status: {
                  code: 403,
                  message: "Forbidden- Not a Admin"
                }
              
    
            })

        }
         

    }catch(err){
        res.status(404).json({
            success: false,
            payload:{  data:null,
                       token:null
                       },
            status: {
              code: 404,
              message: "Cant Delete"
            }
          

        })
        
    }
})

module.exports = router