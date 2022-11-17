const mongoose = require('mongoose')

const FamilySchema = new mongoose.Schema({
    month : {type : String , required : true},
    year : {type : String , required : true},
    totalExpense : [
        { 
            expenseTitle : {type : String , required : true},
            expenseList : [{
                expenseName : {type : String , required : true},
                amount : {type : Number , required : true , default : null},
                createdAtDate : {type : String , required : true},
            }]
         }
    ]
}, {timestamps : true}
)

module.exports = mongoose.model('Family',FamilySchema)