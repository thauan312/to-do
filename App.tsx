import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/Home';
import 'react-native-gesture-handler';
import TaskDetailScreen from './src/screens/TaskDetail';
import { RootStackParamList } from './types'; 

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#E0DCE4', 
            height: 130, 
          },
          headerTintColor: '#2D6C4A', 
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20, 
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: '' }} 
        />
        <Stack.Screen 
          name="Detalhes" 
          component={TaskDetailScreen} 
          options={{ title: 'Detalhes' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
