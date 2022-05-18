import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';
import { StatusBar } from 'react-native';
import { AppProvider } from './src/hooks';
import { Routes } from './src/routes';
import { useAuth } from './src/hooks/auth';

 const App: React.FC = () => {
  const { userStorageLoading } = useAuth();
  const [ fontsLoaded ] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoaded || userStorageLoading) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle='light-content' translucent/>
        <AppProvider>
          <Routes />
        </AppProvider>
    </ThemeProvider>
  );
}


export default App;
