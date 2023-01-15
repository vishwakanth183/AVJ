import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import SplashScreen from "react-native-splash-screen";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux'

//custom file imports
import OrderList from './src/components/OrderList'
import CustomDrawer from './src/shared/customDrawer';
import productList from './src/components/products/productList';
import store from './src/redux/store';

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
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }} drawerContent={(props) => <CustomDrawer props={props} />}>
          <Drawer.Screen name="Home" component={productList} />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
};



export default App;