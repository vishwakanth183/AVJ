const express = require('express')
const mangoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()
app = express();
app.use(cors())
app.use(express.json())
const routers = require('./routes/indexRouter')
app.use(routers)
mydb = {}


// DEV - process.env.MANGODB_URL
// PROD - process.env.PROD_URL
mangoose.connect(process.env.MANGODB_URL).then((res) => {
    mydb = res
    console.log("Connected to mangoDb")
}).catch(() => {
    console.log("Connection to mangoDb failed")
})


app.listen(process.env.PORT || 5000, () => {
    console.log("Welcome to mangoDb Mr.Vishwa")
})