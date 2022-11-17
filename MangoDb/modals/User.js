const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : {type : String , required : true , unique : true},
    email : {type : String , required : true},
    phno : {type : Number , required : true},
    password : {type : String , required : true},
    role : {type : Number , default : false}
}, {timestamps : true}
)

module.exports = mongoose.model('Users',UserSchema)