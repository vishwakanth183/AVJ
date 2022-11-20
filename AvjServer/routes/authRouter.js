const router = require('express').Router();
const AuthController = require('../controller/authController')
const {verifyTokenAndAdmin} = require('./verifyToken')
const statusCodes = require('../statusCodes')

//LOGIN ROUTER
router.post('/login',async(req,res)=>{
    try
    {
        const user =await AuthController.login(req.body);
        res.status(statusCodes.success).json(user)
    }
    catch(err)
    {
        console.log('err login',err)
        res.status(statusCodes.notFound).json(err);
    }
})

//SIGNUP ROUTER
router.post('/register',async(req,res)=>{
    try{
        const newUser = await AuthController.signUp(req.body);
        res.status(statusCodes.success).json('User Created Successfully')
    }
    catch(err)
    {
        res.status(statusCodes.unprocessableEntity).json("Unable to create user.Try again!")
    }

})

//TOKEN CHECK ROUTER (TESTING PURPOSE)
router.post('/verifyToken',verifyTokenAndAdmin,async(req,res)=>{
    // console.log("Next function calling success");
    res.status(statusCodes.success).json('Next Function Calling Success')
})

//ROUTER TO VERIFY SMS
router.post('/sendSms',async(req,res)=>{
    // console.log("send sms notification called");
    try
    {
        const sms = await AuthController.sendSms()
        res.status(statusCodes.success).json('Message send successfully')
    }
    catch(err)
    {
        console.log("Error",err)
        res.status(statusCodes.unprocessableEntity).json('Unable to send message')
    }
})

module.exports = router