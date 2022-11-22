export const API = {
    // Auth
    'SIGN_IN': 'authRouter/login',

    // Product
    'CREATE_PRODUCT': 'productRouter/createProduct',
    'UPDATE_PRODUCT': 'productRouter/updateProduct',
    'GET_ALL_PRODUCTS': 'productRouter/getAllProducts',
    'GET_SINGLE_PRODUCTDETAILS': 'productRouter/getSingleProductDetails',
    'DELETE_PRODUCT_SAFELY': 'productRouter/deleteProductSafely',
    'DELETE_PRODUCT_PERMANENTLY': 'productRouter/deleteProductPermanently',
    'RESTORE_PRODUCT' : 'productRouter/restoreProduct',

    // Expense
    'CREATE_EXPENSE': 'expenseRouter/createExpense',
    'UPDATE_EXPENSE': 'expenseRouter/updateExpense',
    'GET_ALL_EXPENSES': 'expenseRouter/getAllExpenses',
    'GET_SINGLE_EXPENSEDETAILS': 'expenseRouter/getSingleExpenseDetails',

    // Investment
    'CREATE_INVESTMENT': 'investmentRouter/createInvestment',
    'UPDATE_INVESTMENT': 'investmentRouter/updateInvestment',
    'GET_ALL_INVESTMENT': 'investmentRouter/getAllInvestment',
    'GET_SINGLE_INVESTMENT_DETAILS': 'investmentRouter/getSingleInvestmentDetails',

    // Borrowed
    'CREATE_BORROWED': 'borrowedRouter/createBorrowed',
    'UPDATE_BORROWED': 'borrowedRouter/updateBorrowed',
    'GET_ALL_BORROWED': 'borrowedRouter/getAllBorrowed',
    'GET_SINGLE_BORROWED_DETAILS': 'borrowedRouter/getSingleBorrowedDetails',

    // Line Business
    'CREATE_LINEBUSINESS': 'lineBusinessRouter/createLineBusiness',
    'UPDATE_LINEBUSINESS': 'lineBusinessRouter/updateLineBusiness',
    'GET_ALL_LINEBUSINESS': 'lineBusinessRouter/getAllLineBusiness',
    'GET_SINGLE_LINEBUSINESS_DETAILS': 'lineBusinessRouter/getSingleLineBusinessDetails',

    // MAnual Order
    'CREATE_MANUAL_ORDER': 'manualOrderRouter/createManualOrder',
    'UPDATE_MANUAL_ORDER' : 'manualOrderRouter/updateManualOrder',
    'GET_ALL_MANUAL_ORDER': 'manualOrderRouter/getAllManualOrder',
    'GET_SIGNLE_ORDER': 'manualOrderRouter/getSingleOrderDetails',
    'CANCEL_ORDER' : 'manualOrderRouter/cancelOrder'
}