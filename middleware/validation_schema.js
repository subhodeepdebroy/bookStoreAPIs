const Joi = require('joi')
const Mongoose = require("mongoose");
const Joigoose = require("joigoose")(Mongoose);
//const bcrypt = require('bcrypt')
const ress = require('../helper/response-handle')

const loginValSchema = Joi.object({

    
    //_id: Joi.required(),
    userName:  Joi.string().alphanum().min(3).max(30).required()
    .meta({_mongoose:{
        type: String,
        required:true,
        unique:true
        
    }}),
    password: Joi.string().required()
    .meta({_mongoose:{
        type: String,
        required: true
    }}),
    
   
    
})


var loginSchema = new Mongoose.Schema(
    Joigoose.convert(loginValSchema)
  );

  
//   userSchema.pre('save', async function(next){
//     try {
//         const salt= await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(this.password,salt)
//         this.password = hashedPassword 
//         next()
        
//     } catch (error) {
//         res.status(401).json(ress(false,null,null,400,"Password cant be Hased"))
        
//     }
// })  

module.exports = Mongoose.model('User',loginSchema)