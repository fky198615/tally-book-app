const jwt = require("jsonwebtoken");

const auth = (req,res, next)=>{
   try{ 
    //get token from header
    const token = req.header("x-auth-token");

    if(!token){
        return res.status(400).json({msg: "Token is not exist!"});
    }

    const verifyToken = jwt.verify(token, process.env.JWT_TOKEN);

    if(!verifyToken){
        return res.status(400).json({msg: "Invalid token!"});
    }

    req.user = verifyToken.id;
    console.log("verified, ", verifyToken);
    console.log("req.user in auth, ", req.user);
    next();

}catch(err){
    res.status(500).json({err: "Error in verify token " + err.message});
}

}

module.exports = auth;