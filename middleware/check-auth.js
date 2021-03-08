const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const customError = require('../helper/appError');

dotenv.config();

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1];

    if (!token) {
      throw new customError.NotFoundError('Token Empty');
    } else {
      const decode = jwt.verify(token, process.env.KEY);
      if (!decode) {
        throw new customError.NotFoundError('Cant Decode');
      } else {
        req.userData = decode;
        next();
      }
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new customError.BadInputError('Request Timeout, Please Login again');
    } else {
      throw new customError.AuthorizationError('Unauthorized checkAuth');
    }
  }
}
