const jwt = require('jsonwebtoken');
const response = require('../helper/response-handle')
const dotenv = require('dotenv');


dotenv.config();

module.exports = (req, res, next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token,process.env.KEY);
        req.userData = decode;
        next();
    } catch (error) {
        console.log(error)
        
        return res.status(401).json(response(false,null,"Unauthorized checkAuth")

        )
    }
  
}