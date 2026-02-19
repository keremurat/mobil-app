import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CalorieTrackerScreen from '../screens/CalorieTrackerScreen';
import AddMealScreen from '../screens/AddMealScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import WorkoutCategoryScreen from '../screens/WorkoutCategoryScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BMRCalculatorScreen from '../screens/BMRCalculatorScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.card,
    text: COLORS.text,
    border: COLORS.lightGray,
    notification: COLORS.danger,
  },
};

// Stack navigators for each tab
const CalorieStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.card },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="CalorieTracker"
        component={CalorieTrackerScreen}
        options={{ title: 'Kalori Takibi' }}
      />
      <Stack.Screen
        name="AddMeal"
        component={AddMealScreen}
        options={{ title: 'Yemek Ekle' }}
      />
      <Stack.Screen
        name="BMRCalculator"
        component={BMRCalculatorScreen}
        options={{ title: 'BMR Hesaplama' }}
      />
    </Stack.Navigator>
  );
};

const WorkoutStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.card },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="WorkoutMain"
        component={WorkoutScreen}
        options={{ title: 'Egzersiz' }}
      />
      <Stack.Screen
        name="WorkoutCategory"
        component={WorkoutCategoryScreen}
        options={{ title: 'Egzersizler' }}
      />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ title: 'Egzersiz Detayı' }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.card },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.card },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Ana Sayfa' }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Ana Sayfa') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Kalori') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'Egzersiz') {
              iconName = focused ? 'fitness' : 'fitness-outline';
            } else if (route.name === 'Profil') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
          tabBarStyle: {
            backgroundColor: COLORS.card,
            borderTopColor: COLORS.lightGray,
            borderTopWidth: 1,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Ana Sayfa" component={HomeStack} />
        <Tab.Screen name="Kalori" component={CalorieStack} />
        <Tab.Screen name="Egzersiz" component={WorkoutStack} />
        <Tab.Screen name="Profil" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
