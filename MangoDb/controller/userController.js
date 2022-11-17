const Users = require('../modals/User')
const statusCodes = require('../statusCodes')

//Function to delete a user from the user collection
const deleteUser = async(req,res) =>{
    await Users.findByIdAndDelete(req.params.id).then(()=>{
        res.status(statusCodes.success).json('User Deleted Successfully')
    }).catch((err)=>{
        console.log("User Deletion Error",err)
        res.status(statusCodes.unprocessableEntity).json('Something wrong happed ! Unable to delete user')
    })
}

module.exports.deleteUser = deleteUser

//Function to update an user data
const updateUser = async(req,res) =>{
    await Users.findByIdAndUpdate(req.params.id,{
        $set: req.body,
    },{new:true}).then(()=>{
        // console.log("Updated successfully");
        res.status(statusCodes.success).json('User Updated Successfully');
    }).catch((err)=>{
        console.log('Err',err);
        res.status(statusCodes.unprocessableEntity).json('Something wrong happend! Unable to update user')
    })
}
module.exports.updateUser = updateUser

//Function to get all user
const getAllUser = async(req,res) =>{
    const query = req.query.new;
    const allUsers = query ? await Users.find().sort({_id : -1}).limit(2) : await Users.find();
    if(!allUsers)res.status(statusCodes.unprocessableEntity).json("Unable to fetch users! Please try again")
    res.status(statusCodes.success).json(allUsers)
}
module.exports.getAllUser = getAllUser

//Function to get a particular user based on id
const getUserBasedonId = async(req,res) =>{
    console.log('req.params.id',req.params.id)
    const user = await Users.findById(req.params.id);
    if(!user)res.status(statusCodes.unprocessableEntity).json("Unable to fetch users! Please try again")
    res.status(statusCodes.success).json(user)
}
module.exports.getUserBasedonId = getUserBasedonId

//Function to get user status
const getUserStatus = async(req,res) =>{
    console.log('userStatus called')
    const date = new Date();
    const lastYear = new Date(date.setFullYear(new Date(date.getFullYear()-1)));
    try
    {
        // const data = await Users.aggregate([
        //     { $match: { createdAt: { $gte: lastYear } } },
        //     {
        //       $project: {
        //         month: { $month: "$createdAt" },
        //       },
        //     },
        //     {
        //       $group: {
        //         _id: "$month",
        //         total: { $sum: 1 },
        //       },
        //     },
        //   ]);

        // const data = await Users.aggregate([
        //     {$match : {isAdmin : true}},
        //     {$group : {
        //         _id : "isAdmin",
        //         totalAdmin : {$sum : 1}
        //     }}
        // ])

        const data = await Users.aggregate([{
            $lookup : {
                from : 'roles',
                localField : 'role',
                foreignField : 'roleId',
                as : 'userDetails'
            }
        }])
        console.log('data',data)
          res.status(statusCodes.success).json(data)
    }
    catch(err)
    {
        console.log('userStatus Error',err)
        res.status(statusCodes.unprocessableEntity).json("Unable to fetch status! Something wrong happened")
    }
}

module.exports.getUserStatus = getUserStatus