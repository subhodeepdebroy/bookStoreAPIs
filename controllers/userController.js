
const response = require('../helper/response-handle')
const userServices = require('../services/userServices')


/**
 * Logic to Signup with user details
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const signUp = async (req, res, next) => {
  try {

    await userServices.userSignup(req.body);

    return response(true, null, 'Welcome!!', res);
  } catch (error) {
    next(error)
  }
}

/**
 * Logic to Login with checked credentials
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const login = async (req, res, next) => {
  try {

    const token = await userServices.userLogin(req.body);
    req.token = token;


    return response(true, token, 'Authorization Successful', res);


  } catch (error) {
    next(error)
  }
}

/**
 * Logic to Provide all user data to Admin
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const getAllUsersDetails = async (req, res, next) => {
  try {

    const users = await userServices.userGetDetails(req.params, req.userData);
    return response(true, users, 'Authorized', res);
  } catch (err) {
    next(err)
  }
}

/**
 * Logic provide or revoke Admin rights
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      next-Passes control to next Middleware
 */
const controlAdmin = async (req, res, next) => {
  try {

    await userServices.userControlAdmin(req.body, req.userData);
    return response(true, null, 'Admin Status Changed', res);
  } catch (error) {
    next(error);
  }
}



module.exports = { signUp, login, getAllUsersDetails, controlAdmin }
