const ManualOrder = require('../modals/ManualOrder')
const Products = require('../modals/Product')
const LineBusiness = require('../modals/LineBusiness')
const Borrowed = require('../modals/Borrowed')
const FamilyExpense = require('../modals/FamilyExpense')
const Investment = require('../modals/Investment')
const statusCodes = require('../statusCodes')


//Method used to get dashboard details
const getDashBoardDetails = async (req, res) => {

    // Months 
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    // Date Filter
    let filterDate = req.body.filterDate

    // Variable to handle date range
    let startDate = new Date()
    let endDate = new Date()

    if (filterDate) {
        if (filterDate === 'Current Day') {
            startDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
            endDate = new Date(new Date().setUTCHours(23, 59, 59, 999));
        }
        else if (filterDate === 'Previous Day') {
            startDate = new Date(new Date().setDate(new Date().getDate() - 2));
            endDate = new Date(new Date().setDate(new Date().getDate() - 1));
        }
        else if (filterDate === 'This week') {
            startDate = new Date(new Date().setDate(new Date().getDate() - 7));
        }
        else if (filterDate === 'Previous week') {
            startDate = new Date(new Date().setDate(new Date().getDate() - 14));
            endDate = new Date(new Date().setDate(new Date().getDate() - 7));
        }
        else if (filterDate === 'This month') {
            startDate = new Date(new Date().getFullYear(), new Date().getMonth());
        }
        else if (filterDate === 'Previous month') {
            startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
            endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        }
        else if (filterDate === 'Last 3 months') {
            startDate = new Date(new Date().setMonth(new Date().getMonth() - 3))
        }
        else if (filterDate === 'Last 6 months') {
            startDate = new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
        else if (filterDate === 'Last 1 year') {
            startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
        else if (filterDate === 'All Time') {
            startDate = null
            endDate = null
        }
    }

    // console.log(`${filterDate} startDate`, startDate);
    // console.log(`${filterDate} endDate`, endDate)

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
            overallInvestment: {
                totalInvestment: 0,
                totalAmountPaid: 0,
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
        await ManualOrder.find({
            ...{
                ...(startDate && endDate) && {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            isCancelled: false
        }).then((allOrders) => {
            // console.log('allorders length', allOrders.length)
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
        await LineBusiness.find({
            ...{
                ...(startDate && endDate) && {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            }
        }).then((allLineBusinessOrders) => {
            if (allLineBusinessOrders.length) {
                allLineBusinessOrders.map((lineBusiness) => {
                    dashboardDetails.lineBusiness.profit = dashboardDetails.lineBusiness.profit + lineBusiness.profit;
                })
            }
        })

        // Overall Borrowed Value
        await Borrowed.find().then((allBorrowed) => {
            if (allBorrowed.length) {
                allBorrowed.map((borrowed) => {
                    dashboardDetails.borrowedValue.totalBorrowed = borrowed.borrowedAmount,
                        dashboardDetails.borrowedValue.paid = borrowed.paidAmount
                })
            }
        })

        // Current Month Family Expenses
        await FamilyExpense.findOne({
            month: months[Number(new Date().getMonth())],
            year: new Date().getFullYear(),
        }).then((currentMonthExpense) => {
            if (currentMonthExpense) {
                currentMonthExpense.totalExpense.map((allExpenses) => {
                    allExpenses.expenseList.map((singleExpense) => {
                        // console.log(singleExpense)
                        dashboardDetails.familyExpense = dashboardDetails.familyExpense + singleExpense.amount
                    })

                })
            }
        })

        // Investment details
        await Investment.find({
            ...{
                ...(startDate && endDate) && {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            }
        }).then((allInvestment) => {
            if (allInvestment.length) {
                allInvestment.map((investmentDetails) => {
                    dashboardDetails.overallInvestment.totalInvestment += investmentDetails.finalPrice
                    dashboardDetails.overallInvestment.totalAmountPaid += investmentDetails.paidAmount
                })
            }
        })

        // console.log('AVJ Details', dashboardDetails.shopSummary);

        res.status(statusCodes.success).json(dashboardDetails)
    }
    catch (error) {
        console.log('dashboard details error', error)
        res.status(statusCodes.unprocessableEntity).json('Something wrong happened while fetching dashboard details')
    }
}
module.exports.getDashBoardDetails = getDashBoardDetails