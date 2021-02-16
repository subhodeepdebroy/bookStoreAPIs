const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,

    name: {
        type: String,
        required: true
    },
    
    userName: {
        type: String,
        required:true,
        unique:true,
        lowercase:true
        
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        //unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    },
    isAdmin: {
        type: Boolean,
        default: false
    }


})

userSchema.pre('save', async function(next){
    try {
        const salt= await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password,salt)
        this.password = hashedPassword 
        next()
        
    } catch (error) {
        next(error)
        
    }
})

module.exports = mongoose.model('User',userSchema)


