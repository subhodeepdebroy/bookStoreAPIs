const Joi = require('joi')
const Mongoose = require("mongoose");
const Joigoose = require("joigoose")(Mongoose);
const bcrypt = require('bcrypt')
const ress = require('../helper/response-handle')

const userValSchema = Joi.object({

    name: Joi.string().required()
    .meta({_mongoose:{
        type: String,
        required: true
    }}),
    //_id: Joi.required(),
    userName:  Joi.string().alphanum().lowercase().min(3).max(30).required()
    .meta({_mongoose:{
        type: String,
        required:true,
        lowercase:true

        //unique:true
        
    }}),
    password: Joi.string().required()
    .meta({_mongoose:{
        type: String,
        required: true
    }}),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required()
    .meta({_mongoose:{
        type: String,
        //unique: true
    }}),
    isAdmin: Joi.boolean()
    .meta({_mongoose:{
        type: Boolean,
        default: false
    }
})
})


var userSchema = new Mongoose.Schema(
    Joigoose.convert(userValSchema)
  );

  
  userSchema.pre('save', async function(next){
    try {
        const salt= await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password,salt)
        this.password = hashedPassword 
        next()
        
    } catch (error) {
        res.status(401).json(ress(false,null,"Password cant be Hased"))
        
    }
})  

module.exports = Mongoose.model('User',userSchema)