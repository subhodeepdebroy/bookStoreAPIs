const mongoose = require('mongoose')

const url = process.env.MONGO_URL;


mongoose.connect(url, { useNewUrlParser: true })

const connect = mongoose.connection

connect.on('open', (err,res) => {
  if(err){
      console.log(err);
      process.exit(1);
    }
  console.log(`connected...${url}`)
})

module.exports.dbConnection;