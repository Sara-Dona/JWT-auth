const jwt = require('jsonwebtoken');
const config= process.env;

const verifyToken =  (req, res, next) => {
const token =req.body.token || req.query.token || req.headers["x-access-token"];
if(!token) return res.status(403).send({message: "Invalid token for authentication"})
try {
    const decoded= jwt.verify(token, config.TOKEN_KEY)
    req.user=decoded;
    return next;
} catch (error) {
    response.status(401).send({
        success: false,
        message: error.message
    })
    
}

}


module.exports = verifyToken;