import "react-native-gesture-handler"; // MUST be first!
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";

import HomeScreen from "../screens/HomeScreen";
import PlayerScreen from "../screens/MediaPlayer";

// Enable native screens for performance boost
enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Player" component={PlayerScreen} />
        </Stack.Navigator>
      
    </PaperProvider>
  );
}
