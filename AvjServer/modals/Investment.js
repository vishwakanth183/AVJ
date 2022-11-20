const mongoose = require('mongoose')

const InvestmentSchema = new mongoose.Schema({
    buyedFrom: { type: String, required: true },
    purchaseValue: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true },
    finalPrice: { type: Number, default: null },
    travelExpense: { type: Number, required: true, default: 0 },
    paidAmount : { type: Number, required: true, default: 0 },
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

module.exports = mongoose.model('Investment', InvestmentSchema)