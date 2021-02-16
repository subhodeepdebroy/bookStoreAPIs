const jwt = require('jsonwebtoken');
const ress = require('../helper/response-handle')

module.exports = (req, res, next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token,'key');
        req.userData = decode;
        next();
    } catch (error) {
        
        return res.status(401).json(  //wrong Token
          ress(false,null,"Unauthorized")

        )
    }
  
}