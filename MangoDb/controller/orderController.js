const Order = require('../modals/Order')
const statusCodes = require('../statusCodes')

//Method used to create a new order on the table
const createOrder = async(req,res) =>{
  // console.log('req.user',req.user)
  // console.log('req.body',req.body)
  // console.log('req.query',req.query)
  await Order.create({
    userId : req.query.userId,
    cartProducts : req.body.cartProducts,
    totalAmount : req.body.totalAmount,
    address : req.body.address
  }).then((orderResponse)=>{
    res.status(statusCodes.success).json('Order Created Successfully')
  }).catch((orderError)=>{
    // console.log('orderError',orderError)
    res.status(statusCodes.unprocessableEntity).json('Something went wrong while creating order! Try again!')
  })
}
module.exports.createOrder = createOrder

//Method used to get order based on year timestamp
const getOrderByYear = async(req,res) =>{
  console.log('Order list request' , req);
  const endYear = new Date();
  let currentDate = new Date();
  const startYear = new Date(currentDate.setFullYear(new Date(currentDate.getFullYear()-req.query.years)));
  console.log(endYear)
  console.log(startYear)
  try
  {
    const orderData = await Order.aggregate([
      {$match : {createdAt : {$gte : startYear , $lt : endYear}}},
      {$project : { totalAmount : 1 , status : 1 , createdAt : 1}},
    ])
    res.status(statusCodes.success).json({orderData : orderData , count : orderData.length})
  }
  catch(err){
    console.log('Order data fetch error',err);
    res.status(statusCodes.unprocessableEntity).json('Something wrong happened! Try Again')
  }

}

module.exports.getOrderByYear = getOrderByYear

//Method used to get order based on month timestamp
const getOrderByMonth = async(req,res) =>{
  const currentMonth = new Date()
  const queryMonth =  new Date(new Date().setMonth(new Date().getMonth()-req.query.months))
  console.log(currentMonth)
  console.log(queryMonth)
  try
  {
    const orderData = await Order.aggregate([
      {$match : {createdAt : {$gte : queryMonth , $lt : currentMonth}}},
      {$project : { totalAmount : 1 , status : 1 , createdAt : 1}},
    ])
    res.status(statusCodes.success).json({orderData : orderData , count : orderData.length})
  }
  catch(err){
    console.log('Order data fetch error',err);
    res.status(statusCodes.unprocessableEntity).json('Something wrong happened! Try Again')
  }

}

module.exports.getOrderByMonth = getOrderByMonth

//Method used to get order based on week timestamp
const getOrderByWeeks = async(req,res) =>{
  const currentWeek = new Date()
  const queryWeek =  new Date(new Date().setDate(new Date().getDate()-(req.query.weeks*7)))
  console.log(currentWeek)
  console.log(queryWeek)
  try
  {
    const orderData = await Order.aggregate([
      {$match : {createdAt : {$gte : queryWeek , $lt : currentWeek}}},
      {$project : { totalAmount : 1 , status : 1 , createdAt : 1}},
    ])
    res.status(statusCodes.success).json({orderData : orderData , count : orderData.length})
  }
  catch(err){
    console.log('Order data fetch error',err);
    res.status(statusCodes.unprocessableEntity).json('Something wrong happened! Try Again')
  }

}

module.exports.getOrderByWeeks = getOrderByWeeks

//Method used to get order based on hour timestamp
const getOrderByHours = async(req,res) =>{
  const currentHour = new Date()
  const queryHour =  new Date(new Date().setHours(new Date().getHours()-req.query.hours))
  console.log(currentHour)
  console.log(queryHour)
  try
  {
    const orderData = await Order.aggregate([
      {$match : {createdAt : {$gte : queryHour , $lt : currentHour}}},
      {$project : { totalAmount : 1 , status : 1 , createdAt : 1}},
    ])
    res.status(statusCodes.success).json({orderData : orderData , count : orderData.length})
  }
  catch(err){
    console.log('Order data fetch error',err);
    res.status(statusCodes.unprocessableEntity).json('Something wrong happened! Try Again')
  }

}

module.exports.getOrderByHours = getOrderByHours

//Method used to get order based on month timestamp
const getOrderByMoment = async(req,res) =>{
  const currentMoment = new Date()
  let queryMoment;
  if(req.query.moment==='minutes')
  {
    queryMoment =  new Date(new Date().setMinutes(new Date().getMinutes()-req.query.minutes))
  }
  else if(req.query.moment==='seconds')
  {
    queryMoment =  new Date(new Date().setSeconds(new Date().getSeconds()-req.query.seconds))
  }
  else
  {
    queryMoment =  new Date(new Date().setMilliseconds(new Date().getMilliseconds()-req.query.milliseconds))
  }
  console.log(currentMoment)
  console.log(queryMoment)
  try
  {
    const orderData = await Order.aggregate([
      {$match : {createdAt : {$gte : queryMoment , $lt : currentMoment}}},
      {$project : { totalAmount : 1 , status : 1 , createdAt : 1}},
    ])
    res.status(statusCodes.success).json({orderData : orderData , count : orderData.length})
  }
  catch(err){
    console.log('Order data fetch error',err);
    res.status(statusCodes.unprocessableEntity).json('Something wrong happened! Try Again')
  }

}

module.exports.getOrderByMoment = getOrderByMoment