/* eslint-disable no-unused-expressions */
const mongoose = require('mongoose')

const url = process.env.MONGO_URL;

mongoose.connect(url, { useNewUrlParser: true })

const connect = mongoose.connection

connect.on('open', () => {

  console.log(`connected...${url}`)

})
  .on('error', (err, res) => {
    console.log(err);
    process.exit(1);

  })

module.exports.dbConnection;
