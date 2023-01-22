import React, { FC, useEffect } from 'react';
import { View, ActivityIndicator , StatusBar } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom imports
import CustomDrawer from '../../src/shared/customDrawer';
import Dashboard from '../../src/components/dashboard/dashboard';
import ProductList from '../../src/components/products/productList';
import RestoreProducts from '../../src/components/products/restoreProductsList';
import OrderList from '../../src/components/revenue/orders/OrderList'
import LineBusiness from '../../src/components/revenue/lineBusiness/lineBusinessList';
import Investment from '../../src/components/expenses/investment/investmentList';
import FamilyExpenses from '../../src/components/expenses/familyExpense/familyExpenseList';
import Borrowed from '../../src/components/expenses/borrowed/borrowedList';
import store, { useAppDispatch } from '../../src/redux/store';
import { theme } from '../../src/theme/theme';
import { BorrowedNavigation, DashboardNavigation, FamilyExpenseNavigation, InvestmentNavigation, LineBusinessNavigation, OrderListNavigation, ProductNavigation, RestoreProductNavigation, SigninNavigation } from '../../src/shared/commonConstant/navigationConstants';
import { RootState } from '../redux/rootReducer';
import Signin from '../components/auth/signin';
import { CLOSE_COMMON_LOADER } from '../redux/actionConstants';
import { appColors } from '../theme/appcolors';
import { closeCommonLoader } from '../redux/actions/commonActions';
import { setUserDetails } from '../redux/actions/authActions';


const Mainstack: FC = () => {

    // Drawer navigator
    const Drawer = createDrawerNavigator();

    // Stack
    const Stack = createStackNavigator()

    // Common redux reducer
    const commonReducer = useSelector((state: RootState) => state.commonReducer)
    const dispatch = useAppDispatch()

    //Function to check user login
    const loginCheck = async () => {
        const authToken = await AsyncStorage.getItem('authToken');
        if (authToken) {
            const userDetails = await AsyncStorage.getItem('userDetails')
            dispatch(setUserDetails({
                userDetails : userDetails ? JSON.parse(userDetails) : {}
            }))
        }
        else {
            dispatch(closeCommonLoader())
        }
    }

    // useEffect to check whether the user is logged in or not
    useEffect(() => {
            loginCheck()
            return(()=>{
                console.log('on page leave')
            })
    }, [])

    return (
        <NavigationContainer>

            {
                commonReducer.commonLoader ?

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' , backgroundColor : appColors.light }}>
                        <StatusBar backgroundColor={appColors.light}/>
                        <ActivityIndicator color={appColors.primary} size='large' />
                    </View> :

                    commonReducer.isLoggedIn ?

                        <Drawer.Navigator initialRouteName={DashboardNavigation} screenOptions={{ headerShown: false }} drawerContent={(props) => <CustomDrawer props={props} />}>
                            <Drawer.Screen name={DashboardNavigation} component={Dashboard} />
                            <Drawer.Screen name={ProductNavigation} component={ProductList} />
                            <Drawer.Screen name={RestoreProductNavigation} component={RestoreProducts} />
                            <Drawer.Screen name={LineBusinessNavigation} component={LineBusiness} />
                            <Drawer.Screen name={OrderListNavigation} component={OrderList} />
                            <Drawer.Screen name={InvestmentNavigation} component={Investment} />
                            <Drawer.Screen name={FamilyExpenseNavigation} component={FamilyExpenses} />
                            <Drawer.Screen name={BorrowedNavigation} component={Borrowed} />
                        </Drawer.Navigator>

                        :

                        <Stack.Navigator>
                            <Stack.Screen name={SigninNavigation} component={Signin}
                                options={{
                                    headerShown: false
                                }}
                            />
                        </Stack.Navigator>
            }
        </NavigationContainer>
    );
}

export default Mainstack