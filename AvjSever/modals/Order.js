const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    userId : {type : String , required : true},
    cartProducts : [{
        productId : {type : Number , required:true},
        quantity : {type : Number , default : 1},
        amount : {type : Number}
    }],
    totalAmount : {type : Number , required : true},
    address : {type : Object , required : true},
    status : {type : String , default : 'pending'}
}, {timestamps : true}
)

module.exports = mongoose.model('Orders',OrderSchema)