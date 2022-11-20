const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    productName: { type: String, required: true, unique: true },
    brandName : {type : String , required : true , default : 'No brand'},
    minimumStock : { type: Number, default: 0 },
    image: { type: String, default: null },
    purchasePrice: { type: Number, default: 0 },
    salesPrice: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    productType: { type: String, required: true },
    weightUnit: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    description: { type: String, default: null },
    labelArray : {type : Array , default : []}
}, { timestamps: true }
)

module.exports = mongoose.model('Products', ProductSchema)