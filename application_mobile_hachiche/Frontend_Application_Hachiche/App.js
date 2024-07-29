import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import PlantScreen from './Screens/PlantSreen';
import FormScreen from './Screens/FormScreen';
import ResponsableDecontaminationScreen from './Screens/ResponsableDecontaminationScreen';
import AddEntreposageScreen from './Screens/AddEntreposageScreen';
import ResponsableScreenAdd from './Screens/ResponsableScreenAdd';
import EntreposageScreen from './Screens/EntreposageScreen';
import QRScannerScreen from './Screens/QRScannerScreen';
import PlantInfoScreen from './Screens/PlantInfoScreen';
import HistoriqueScreen from './Screens/HistoriqueScreen';
import ImportScreen from './Screens/ImportScreen';
import GraphScreen from './Screens/GraphScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Plant" component={PlantScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PlantForm" component={FormScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResponsableDecontamination" component={ResponsableDecontaminationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddEntreposage" component={AddEntreposageScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddResponsable" component={ResponsableScreenAdd} options={{ headerShown: false }} />
        <Stack.Screen name="Entreposage" component={EntreposageScreen} options={{ headerShown: false }} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PlantInfo" component={PlantInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Historique" component={HistoriqueScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Import" component={ImportScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Graph" component={GraphScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
