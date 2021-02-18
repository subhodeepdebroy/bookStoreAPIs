const jwt = require('jsonwebtoken');
const response = require('../helper/response-handle')

module.exports = (req, res, next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token,'key');
        req.userData = decode;
        next();
    } catch (error) {
        console.log(error)
        
        return res.status(401).json(response(false,null,"Unauthorized checkAuth")

        )
    }
  
}