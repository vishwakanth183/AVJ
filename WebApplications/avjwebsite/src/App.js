import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { Provider } from 'react-redux'

// Custom file imports
import CustomDrawer from './components/drawer/CustomDrawer';
import store from '../src/redux/store'


function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <CustomDrawer />
        </ChakraProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
