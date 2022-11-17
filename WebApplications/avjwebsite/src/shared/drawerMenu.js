export const drawerMenu = [
    {
        title: 'Dashboard',
        linkto: '/'
    },
    {
        title: 'Products',
        submenu: [
            {
                submenuTitle: 'ProductList',
                linkto: '/productList'
            },
            {
                submenuTitle: 'AddProducts',
                linkto: '/addproduct'
            },
            {
                submenuTitle : 'Restore Products',
                linkto : '/restoredProductList'
            }
        ]
    },
    {
        title: 'Revenue',
        submenu: [
            {
                submenuTitle: 'Orders',
                linkto: '/orders'
            },
            {
                submenuTitle: 'LineBusiness',
                linkto: '/lineBuisness'
            }
        ]
    },
    {
        title: 'Expenses',
        submenu: [
            {
                submenuTitle: 'Investment',
                linkto: '/investment'
            },
            {
                submenuTitle: 'Family Expenses',
                linkto: '/familyexpense'
            },
            {
                submenuTitle: 'Borrowed',
                linkto: '/borrowedList'
            }
        ]
    },
    {
        title: 'Settings',
        linkto: '/settings'
    },
];