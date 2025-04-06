import React from "react";
import { Text, TouchableOpacity, Dimensions } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons"; // Using Material Icons for a stylish arrow

const { width, height } = Dimensions.get("window");

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={() => {
        scale.value = withSpring(0.94);
        opacity.value = withSpring(1);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
        opacity.value = withSpring(0.8);
      }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            width: width * 0.5, // Optimal width
            height: height * 0.06, // Balanced height
            borderRadius: 30,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 20,
            backgroundColor: "transparent", // Fully transparent
          },
        ]}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            letterSpacing: 1,
            color: "#fff",
            fontFamily: "Exo2-Bold",
          }}
        >
          {title}
        </Text>

        {/* Right Arrow Icon */}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default CustomButton;
