import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Text as RNText,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import LottieView from "lottie-react-native";
import * as Font from "expo-font";
import CustomButton from "../components/CustomButton";

const { width, height } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [fontLoaded, setFontLoaded] = useState(false);

  const animationScale = 1.5;

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "Exo2-Italic": require("../fonts/Exo_2/static/Exo2-Italic.ttf"),
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Player");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation]);

  if (!fontLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 relative">
      {/* Lottie Background */}
      <LottieView
        source={require("../animations/Animation.json")}
        autoPlay
        loop
        style={{
          position: "absolute",
          width: width * animationScale,
          height: height * animationScale,
          top: 0,
          left: 0,
        }}
      />

      {/* Centered Overlay Content */}
      <View className="w-full h-full justify-center items-center px-6 space-y-6">
        <RNText onPress={()=>navigation.navigate("Player")}
          style={{
            fontSize: width * 0.12,
            fontFamily: "Exo2-Italic",
            color: theme.colors.primary,
            textAlign: "center",
            textShadowColor: "rgba(0, 0, 0, 0.3)",
            textShadowOffset: { width: 4, height: 4 },
            textShadowRadius: 6,
            letterSpacing: 3,
          }}
        >
          Translatify
        </RNText>

        
      </View>
    </View>
  );
};

export default HomeScreen;
