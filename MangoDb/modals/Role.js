const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    roleId : {type : Number , unique:true , required: true},
    role : {type : String , unique : true , required : true}
},{timestamps:true})

module.exports = mongoose.model('Roles',RoleSchema);