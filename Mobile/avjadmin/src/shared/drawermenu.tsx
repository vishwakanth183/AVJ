import { BorrowedNavigation, DashboardNavigation, FamilyExpenseNavigation, InvestmentNavigation, LineBusinessNavigation, OrderListNavigation, ProductNavigation, RestoreProductNavigation } from "./commonConstant/navigationConstants";

const MaterialIcon = 'material'
const MaterialCommunityIcons = 'material-community' 
const FontAwesome5 = 'font-awesome-5'
const FontAwesome = 'font-awesome'
const Ionicon = 'ionicon'
const AntDesign = 'antdesign'
const Entypo = 'entypo'


export const drawerMenu = [
    {
        title: 'Dashboard',
        navigateTo : DashboardNavigation
    },
    {
        title: 'Products',
        submenu: [
            {
                submenuTitle: 'ProductList',
                navigateTo : ProductNavigation,
                iconName : 'box-open',
                iconType : FontAwesome5
            },
            {
                submenuTitle : 'Restore Products',
                navigateTo : RestoreProductNavigation,
                iconName : 'restore',
                iconType : MaterialIcon
            }
        ]
    },
    {
        title: 'Revenue',
        submenu: [
            {
                submenuTitle: 'Orders',
                navigateTo : OrderListNavigation,
                iconName : 'clipboard-edit-outline',
                iconType : MaterialCommunityIcons
            },
            {
                submenuTitle: 'LineBusiness',
                navigateTo : LineBusinessNavigation,
                iconName : 'account-group',
                iconType : MaterialCommunityIcons
            }
        ]
    },
    {
        title: 'Expenses',
        submenu: [
            {
                submenuTitle: 'Investment',
                navigateTo : InvestmentNavigation,
                iconName : 'cash-multiple',
                iconType : MaterialCommunityIcons
            },
            {
                submenuTitle: 'Family Expenses',
                navigateTo : FamilyExpenseNavigation,
                iconName : 'wallet-outline',
                iconType : Ionicon
            },
            {
                submenuTitle: 'Borrowed',
                navigateTo : BorrowedNavigation,
                iconName : 'warning-outline',
                iconType : Ionicon
            }
        ]
    },
];