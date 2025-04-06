import * as React from "react";
import { Appbar } from "react-native-paper";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

interface AppbarHeaderProps {
  isPlaying: boolean;
  isTranslating: boolean;
  onTogglePlayPause: () => void;
  onToggleTranslation: () => void;
  onSearchPress: () => void;
}

const AppbarHeader: React.FC<AppbarHeaderProps> = ({
  isPlaying,
  isTranslating,
  onTogglePlayPause,
  onToggleTranslation,
  onSearchPress,
}) => {
  const navigation = useNavigation();

  return (
    <Appbar.Header
      style={{
        backgroundColor: "#1E1E1E",
        elevation: 4,
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      {/* Back Button at the Left Corner */}
      <Appbar.BackAction onPress={() => navigation.goBack()} color="#ccc" />

      {/* Title */}
      <Appbar.Content
        title="Translatify"
        titleStyle={{
          fontSize: 22,
          fontStyle: "italic",
          color: "#00ffcc",
          fontFamily: "Exo2-Italic",
        }}
        subtitle="Live Audio Translator"
        subtitleStyle={{
          fontSize: 14,
          color: "#ccc",
          fontFamily: "Custom-Regular",
        }}
      />

      {/* Toggle Translation */}
      <Appbar.Action
        icon={isTranslating ? "translate" : "translate-off"}
        size={24}
        color={isTranslating ? "#00ffcc" : "#888"}
        onPress={onToggleTranslation}
      />

      {/* Search */}
      <Appbar.Action icon="magnify" onPress={onSearchPress} />

      {/* More Options */}
      <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
    </Appbar.Header>
  );
};

export default AppbarHeader;
