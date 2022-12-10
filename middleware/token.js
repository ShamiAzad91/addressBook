const jwt = require("jsonwebtoken");
const SECRET_KEY = "iamgroot"

const verifyToken = (req,res,next)=>{

    let token = req.headers.authorization;
    if(token){
        token = token.split(' ')[1];
        let user = jwt.verify(token,SECRET_KEY);
        req.userId = user.id;

    }else{
        return res.status(401).json({message:"unauthorized User"})
    }

    next();
}
module.exports = verifyToken;