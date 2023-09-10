const User = require("../model/User/User");
const appErr = require("../utils/appErr");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");


const isAdmin =async (req,res,next) => {
    //get token from header
    const token = getTokenFromHeader(req);
    //verify the token
    const decodedUser = verifyToken(token);
    
    //save the user into req obj
    req.userAuth = decodedUser.id

    const user = await User.findById(decodedUser.id);
    if(user.isAdmin){
      return next();
    }
    else{
      return next(appErr("Access denied", 403));
    }
    
    
}

module.exports = isAdmin;

