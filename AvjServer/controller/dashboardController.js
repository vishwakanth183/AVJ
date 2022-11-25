const ManualOrder = require('../modals/ManualOrder')
const Products = require('../modals/Product')
const LineBusiness = require('../modals/LineBusiness')
const Borrowed = require('../modals/Borrowed')
const FamilyExpense = require('../modals/FamilyExpense')
const statusCodes = require('../statusCodes')


//Method used to get dashboard details
const getDashBoardDetails = async (req, res) => {

    //Months 
    const months = ['January' , 'February' , 'March' , 'April' , 'May' , 'June' , 'July' , 'August' , 'September' , 'October' , 'November' , 'December']

    try {
        let dashboardDetails = {
            stockValue: 0,
            shopSummary: {
                purchaseValue: 0,
                discount: 0,
                soldValue: 0,
                shopProfit: 0,
                paidAmount: 0,
            },
            lineBusiness: {
                profit: 0,
            },
            borrowedValue: {
                totalBorrowed: 0,
                paid: 0
            },
            familyExpense: 0,
        }

        // Getting stock value
        await Products.find({
            isDeleted: false
        }).then((totalStock) => {
            totalStock.map((products) => {
                dashboardDetails.stockValue = dashboardDetails.stockValue + (products.salesPrice * products.stock)
            })
        })

        // Shop profit
        await ManualOrder.find().then((allOrders) => {
            if (allOrders.length) {
                allOrders.map((order) => {
                    dashboardDetails.shopSummary.soldValue = dashboardDetails.shopSummary.soldValue + order.checkoutSummary.finalPrice;
                    dashboardDetails.shopSummary.purchaseValue = dashboardDetails.shopSummary.purchaseValue + order.checkoutSummary.orderPurchasePrice;
                    dashboardDetails.shopSummary.discount = dashboardDetails.shopSummary.discount + order.checkoutSummary.discount;
                    dashboardDetails.shopSummary.shopProfit = dashboardDetails.shopSummary.shopProfit + order.checkoutSummary.profit;
                    dashboardDetails.shopSummary.paidAmount = dashboardDetails.shopSummary.paidAmount + order.checkoutSummary.paidAmount
                })
            }
        })

        //  LineBusiness profit
        await LineBusiness.find().then((allLineBusinessOrders) => {
            if (allLineBusinessOrders.length) {
                allLineBusinessOrders.map((lineBusiness) => {
                    dashboardDetails.lineBusiness.profit = dashboardDetails.lineBusiness.profit + lineBusiness.profit;
                })
            }
        })

        // Overall Borrowed Value
        await Borrowed.find().then((allBorrowed)=>{
            if(allBorrowed.length)
            {
                allBorrowed.map((borrowed)=>{
                    dashboardDetails.borrowedValue.totalBorrowed = borrowed.borrowedAmount,
                    dashboardDetails.borrowedValue.paid = borrowed.paidAmount
                })
            }
        })

        // Current Month Family Expenses
        await FamilyExpense.findOne({
            month : months[Number(new Date().getMonth())],
            year : new Date().getFullYear(),
        }).then((currentMonthExpense)=>{
            if(currentMonthExpense)
            {
                currentMonthExpense.totalExpense.map((allExpenses)=>{
                    allExpenses.expenseList.map((singleExpense)=>{
                        // console.log(singleExpense)
                        dashboardDetails.familyExpense = dashboardDetails.familyExpense + singleExpense.amount
                    })
                    
                })
            }
        })

        console.log('AVJ Details', dashboardDetails);

        res.status(statusCodes.success).json(dashboardDetails)
    }
    catch (error) {
        console.log('dashboard details error', error)
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened while fetching dashboard details')
    }
}
module.exports.getDashBoardDetails = getDashBoardDetails