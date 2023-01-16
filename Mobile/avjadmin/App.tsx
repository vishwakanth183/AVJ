import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { ThemeProvider } from 'react-native-elements';
import SplashScreen from "react-native-splash-screen";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux'

//custom file imports
import CustomDrawer from './src/shared/customDrawer';
import Dashboard from './src/components/dashboard/dashboard';
import ProductList from './src/components/products/productList';
import RestoreProducts from './src/components/products/restoreProductsList';
import OrderList from './src/components/revenue/orders/OrderList'
import LineBusiness from './src/components/revenue/lineBusiness/lineBusinessList';
import Investment from './src/components/expenses/investment/investmentList';
import FamilyExpenses from './src/components/expenses/familyExpense/familyExpenseList';
import Borrowed from './src/components/expenses/borrowed/borrowedList';
import store from './src/redux/store';
import { theme } from './src/theme/theme';
import { BorrowedNavigation, DashboardNavigation, FamilyExpenseNavigation, InvestmentNavigation, LineBusinessNavigation, OrderListNavigation, ProductNavigation, RestoreProductNavigation } from './src/shared/commonConstant/navigationConstants';

const App: React.FC = () => {

  const Drawer = createDrawerNavigator();

  //Hide Splash screen on app load.
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500)
  }, []);

  return (
    <Provider store={store}>
      {/* <ThemeProvider theme={theme}> */}
      <NavigationContainer>
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
      </NavigationContainer>
      {/* </ThemeProvider> */}
    </Provider>
  );
};



export default App;