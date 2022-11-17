const router = require('express').Router();
const {verifyTokenAndAdmin} = require('./verifyToken')
const productController = require('../controller/productController')

//Router to create a products
router.post('/createProduct',verifyTokenAndAdmin,productController.createProduct)

//Router to get a particular product details
router.post('/getSingleProductDetails',verifyTokenAndAdmin,productController.getSingleProductDetails)

//Router to update a product
router.put('/updateProduct',productController.updateProduct)

//Router to delete a product safely
router.delete('/deleteProductSafely',productController.deleteProductSafely)

//Router to delete a product permanently
router.delete('/deleteProductPermanently',productController.deleteProductPermanently)

//Router to delete a product permanently
router.put('/restoreProduct',productController.restoreProduct)

//Router to get all product
router.post('/getAllProducts',verifyTokenAndAdmin,productController.getAllProducts)

//Router to get a particular product based on name
router.post('/getAllProductsByName',verifyTokenAndAdmin,productController.getAllProductsByName)

//Router to get product based on query
router.post('/getAllProductsByQuery',verifyTokenAndAdmin,productController.getAllProductsByQuery)

module.exports = router