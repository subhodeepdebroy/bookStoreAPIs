const app = require('./app')
const dbConnection = require('./dbConnection')
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT ;

/**
 * Server listening to Port 3000
 */
app.listen(port, (err, res) => {
    if (err) {
      console.error(err + "Error!!")
    }
    console.log('Server started listening to port '+ port);
  })