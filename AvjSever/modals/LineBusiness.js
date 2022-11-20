const mongoose = require('mongoose')

const LineBusinessSchema = new mongoose.Schema({
    buyedFrom: { type: String, required: true },
    soldTo: { type: String, required: true },
    purchaseValue: { type: Number, required: true, default: 0 },
    soldValue: { type: Number, required: true, default: 0 },
    profit: { type: Number, required: true, default: 0 },
    travelExpense: { type: Number, required: true, default: 0 },
    paidAmount: { type: Number, required: true, default: 0 },
    description: { type: String, default: null },
    orderedProducts: [
        {
            productName: { type: String, required: true },
            amount: { type: Number, required: true, default: 0 },
            quantity: { type: Number, required: true },
            sgst: { type: Number, default: 0 },
            cgst: { type: Number, default: 0 }
        }
    ]
}, { timestamps: true }
)

module.exports = mongoose.model('LineBusiness', LineBusinessSchema)