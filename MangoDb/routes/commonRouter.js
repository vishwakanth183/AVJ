const router = require('express').Router();
const multer = require('multer')
const commonController = require('../controller/commonController')
const {verifyTokenAndAdmin} = require('./verifyToken')

const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        console.log(file);
        cb(null,true);
    }
})

//ROUTER TO SEND EMAIL
router.post('/sendEmail',commonController.sendEmail)

//ROUTER TO CREATE ROLE
router.post('/createRole',commonController.createRole)

//ROTER TO CHECK MULTER WITH SHARP
router.post('/imageUpload',upload.single('image'),commonController.imageUpload)

module.exports = router