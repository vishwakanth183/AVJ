import 'react-native-gesture-handler';
import React,{useEffect} from 'react';
import SplashScreen from "react-native-splash-screen";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

//custom file imports
import OrderList from './src/components/OrderList'
import CustomDrawer from './src/shared/customDrawer';

const App: React.FC = () => {

  const Drawer = createDrawerNavigator();

  //Hide Splash screen on app load.
  useEffect(() => {
    setTimeout(()=>{
      SplashScreen.hide();
    },2000)
  },[]);

  return (
    <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home" screenOptions={{headerShown:false}} drawerContent={(props)=> <CustomDrawer props={props}/>}>
          <Drawer.Screen name="Home" component={OrderList} />
        </Drawer.Navigator>
    </NavigationContainer>
  );
};



export default App;