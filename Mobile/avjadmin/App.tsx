import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { ThemeProvider } from 'react-native-elements';
import SplashScreen from "react-native-splash-screen";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux'

//custom file imports
import store from './src/redux/store';
import { theme } from './src/theme/theme';
import Mainstack from './src/stack/mainStack';

const App: React.FC = () => {

  //Hide Splash screen on app load.
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500)
  }, []);

  return (
    <Provider store={store}>
      {/* <ThemeProvider theme={theme}> */}
      <Mainstack />
      {/* </ThemeProvider> */}
    </Provider>
  );
};



export default App;