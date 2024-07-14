import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="  MovieFix" component={HomeScreen}   options={{
          headerStyle: {
            backgroundColor: '#121212',
            elevation: 10,
            shadowOpacity: 0, 
          },
          headerTintColor:'red',
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
          },
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStackNavigator;
