const jwt = require("jsonwebtoken");

function authMiddleware(req,res,next){
    const token = req.headers.token;
    
        if(!token){
            return res.status(403).json({
                message:"Youre not logged in"
            });
        }
    
        const decode = jwt.verify(token,"chandan123");
        const username = decode.username;
    
        if(!username){
            res.status(403).json({
                message:"Malformed token"
            })
            return
        }

        req.username = username;

        next();
}

module.exports = authMiddleware;
