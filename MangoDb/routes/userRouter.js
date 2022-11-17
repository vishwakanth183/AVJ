const router = require('express').Router();
const {verificationToken} = require('./verifyToken')
const UserController = require('../controller/userController')

//Router to delete a particular user
router.post('/delete/:id',verificationToken,UserController.deleteUser)

//Router to update a particular user
router.put('/update/:id',UserController.updateUser)

//Router to get all users
router.get('/getAllUsers',UserController.getAllUser)

//Router to get a particular user based on id
router.post('/getUserById/:id',UserController.getUserBasedonId)

//Router to get user stats
router.get('/getUserStats',UserController.getUserStatus)

module.exports = router