const router = require('express').Router();

app.use('/authRouter',require('./authRouter'))
app.use('/userRouter',require('./userRouter'))
app.use('/commonRouter',require('./commonRouter'))
app.use('/productRouter',require('./productRouter'))
app.use('/manualOrderRouter',require('./manualOrderRouter'))
app.use('/expenseRouter',require('./familyRouter'))
app.use('/investmentRouter',require('./investmentRouter'))
app.use('/lineBusinessRouter',require('./lineBusinessRouter'))
app.use('/borrowedRouter',require('./borrowedRouter'))
app.use('/dashboardRouter',require('./dashboardRouter'))


module.exports = router