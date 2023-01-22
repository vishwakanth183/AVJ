const products = require('../modals/Product');
const statusCodes = require('../statusCodes')

//Function used to create a product
const createProduct = async (req, res) => {

    const productData = req.body;
    console.log(req.body)

    await products.create({
        productName: productData.productName,
        brandName : productData.brandName,
        image: productData.image,
        minimumStock : productData.minimumStock,
        purchasePrice: productData.purchasePrice,
        salesPrice: productData.salesPrice,
        stock: productData.stock,
        sgst : productData.sgst,
        cgst : productData.cgst,
        productType: productData.productType,
        description: productData.description,
        weightUnit : productData.weightUnit,
        labelArray : productData.labelArray,
    }).then(() => {
        res.status(statusCodes.success).json('Product created successfully')
    }).catch((error) => {
        console.log('error', error)
        if (error.code === 11000) {
            res.status(statusCodes.unprocessableEntity).json("Duplicate product ! Can't add a product with same name more than once")
        }
        else {

            res.status(statusCodes.unprocessableEntity).json('Something wrong happened in creating product! Try Again!')
        }
    })
}
module.exports.createProduct = createProduct

//Function to get a particular product details
const getSingleProductDetails = async (req, res) => {
    await products.findById(req.body.productId).then((productDetails) => {
        res.status(statusCodes.success).json(productDetails);
    }).catch((error) => {
        console.log("Update error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in getting the product details! Try Again!')
    })
}

module.exports.getSingleProductDetails = getSingleProductDetails

//Function to update a particular product
const updateProduct = async (req, res) => {
    // console.log('Inside update product', req.query, req.body);
    await products.findByIdAndUpdate(req.query.productId, {
        $set: req.body.data
    }, { new: true }).then((updatedProduct) => {
        // console.log('updatedProduct', updatedProduct);
        res.status(statusCodes.success).json('Product Updated Successfully');
    }).catch((error) => {
        console.log("Update error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in updating the product! Try Again!')
    })
}
module.exports.updateProduct = updateProduct

//Function to delete a particular product
const deleteProductSafely = async (req, res) => {
    // console.log('Inside deleteProductSafely', req.query);
    await products.findByIdAndUpdate(req.query.deleteId, {
        $set: { isDeleted: true }
    }, { new: true }).then(() => {
        res.status(statusCodes.success).json('Product deleted Successfully');
    }).catch((error) => {
        // console.log("Delete error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in deleting the product! Try Again!')
    })
}
module.exports.deleteProductSafely = deleteProductSafely

//Function to delete a particular product
const deleteProductPermanently = async (req, res) => {
    // console.log('Inside deleteProductPermanently', req.query);
    await products.findByIdAndDelete(req.query.deleteId).then(() => {
        res.status(statusCodes.success).json('Product deleted Successfully');
    }).catch((error) => {
        console.log("Delete error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in deleting the product! Try Again!')
    })
}
module.exports.deleteProductPermanently = deleteProductPermanently

//Function to restore a particular product
const restoreProduct = async (req, res) => {
    console.log('Inside restoreProduct', req.query);
    await products.findByIdAndUpdate(req.query.productId, {
        $set: { isDeleted: false }
    }, { new: true }).then(() => {
        res.status(statusCodes.success).json('Product restored Successfully');
    }).catch((error) => {
        // console.log("Delete error", error);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened in restoring the product! Try Again!')
    })
}
module.exports.restoreProduct = restoreProduct


//Function to get all the products available in store
const getAllProducts = async (req, res) => {

    const search = new RegExp(req.body.search)
    const offset = req.body.offset ? req.body.offset : 0
    const limit = req.body.limit ? req.body.limit : 100
    const isDeleted = req.body.isDeleted ? true : false
    const productType = req.body.productType && req.body.productType!='All Type' ? req.body.productType : false

    // console.log('Inside get all products');
    await products.find({
        isDeleted: isDeleted,
        ...{...productType && {
            productType : productType
        }},
        productName: search
    }).skip(offset).limit(limit).then(async (response) => {
        await products.count({
            isDeleted: isDeleted,
            ...{...productType && {
                productType : productType
            }},
            productName: search
        }).then((countRes) => {
            res.status(statusCodes.success).json({
                listData : response,
                totalCount : countRes
            });
        }).catch((err) => {
            res.status(statusCodes.notFound).json(err)
        })
    }).catch((error) => {
        res.status(statusCodes.notFound).json(error)
    })
}
module.exports.getAllProducts = getAllProducts

//Function to get all products based on product name
const getAllProductsByName = async (req, res) => {
    // console.log('Inside create product');
    await products.aggregate([
        { $match: req.body.name }
    ]).then((response) => {
        res.status(statusCodes.success).json(response);
    }).catch((error) => {
        res.status(statusCodes.notFound).json(error)
    })
    // console.log('Inside create product');
}
module.exports.getAllProductsByName = getAllProductsByName

//Function to get all products based on query
const getAllProductsByQuery = () => {
    console.log('Inside create product');
}
module.exports.getAllProductsByQuery = getAllProductsByQuery







