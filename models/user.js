const Mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const usersSchema = new Mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,

  name: {
    type: String,
    required: true,
  },

  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,

  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    //unique: true,
    //match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,

  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  dob: {
    type: Date,
    required: true,
  }

})
usersSchema.index({userName:1},{unique:true})

usersSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
  } catch (error) {
    next(error)
  }
})

module.exports = Mongoose.model('user', usersSchema)
