import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import AddEditWorkoutScreen from '../screens/AddEditWorkoutScreen';
import GoalsScreen from '../screens/GoalsScreen';
import GPSRunningScreen from '../screens/GPSRunningScreen';
import QRScanScreen from '../screens/QRScanScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function WorkoutsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Workouts" component={WorkoutsScreen} />
      <Stack.Screen name="AddEditWorkout" component={AddEditWorkoutScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Workouts" component={WorkoutsStack} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Track" component={GPSRunningScreen} />
      <Tab.Screen name="Scanner" component={QRScanScreen} />
    </Tab.Navigator>
  );
}
