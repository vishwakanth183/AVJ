const jwt = require('jsonwebtoken')
const statusCodes = require('../statusCodes')

//VERIFICATION TOKEN
const verificationToken = async(req,res,next) =>{
    const authHeader =req.headers.authorization && req.headers.authorization.split(" ")[1];
    if(authHeader)
    {
        jwt.verify(authHeader,process.env.JWT_KEY,(err,user)=>{
            if(err)res.status(statusCodes.unauthorized).json('Token Invalid');
            else
            {
                req.user = user;
                next()
            }
        });
    }
    else
    {
        res.status(401).json('You are not authenticated');
    }
}

//VERIFICATION AND ADMIN FUNCTIONALITY
const verifyTokenAndAdmin = async(req,res,next) =>{
    // console.log('req.user',req.user)
    verificationToken(req,res,()=>{
        if(req.user && req.user.id && req.user.role === 1)
        {
            next();
        }
        else
        {
            res.status(statusCodes.forbidden).json('You are not authenticated')
        }
    })
}

module.exports = {verificationToken,verifyTokenAndAdmin}