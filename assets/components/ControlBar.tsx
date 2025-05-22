import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Tooltip } from "react-native-paper";
import Slider from "@react-native-community/slider";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Entypo,
} from "@expo/vector-icons";

interface ControlBarProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPickMedia: () => void;
  onSpeechToText: () => void;
  onTranslate: () => void;
  onTextToSpeech: () => void;
  playTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isRepeat: boolean;
  onToggleRepeat: () => void;
  onToggleFullScreen: () => void;
}

const ControlBar: React.FC<ControlBarProps> = ({
  isPlaying,
  onPlayPause,
  onPickMedia,
  onSpeechToText,
  onTranslate,
  onTextToSpeech,
  playTime,
  duration,
  onSeek,
  isRepeat,
  onToggleRepeat,
  onToggleFullScreen,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Tooltip title={isPlaying ? "Pause" : "Play"}>
          <IconButton
            icon={() => (
              <Ionicons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={35}
                color="#1DB954"
              />
            )}
            onPress={onPlayPause}
          />
        </Tooltip>

        <Tooltip title={isRepeat ? "Repeat On" : "Repeat Off"}>
          <IconButton
            icon={() => (
              <Ionicons
                name="repeat"
                size={30}
                color={isRepeat ? "#1DB954" : "white"}
              />
            )}
            onPress={onToggleRepeat}
          />
        </Tooltip>

        <Tooltip title="Select File">
          <IconButton
            icon={() => (
              <MaterialIcons name="video-library" size={30} color="white" />
            )}
            onPress={onPickMedia}
          />
        </Tooltip>

        <Tooltip title="Speech to Text">
          <IconButton
            icon={() => <Ionicons name="mic-outline" size={30} color="white" />}
            onPress={onSpeechToText}
          />
        </Tooltip>

        <Tooltip title="Translate">
          <IconButton
            icon={() => (
              <FontAwesome5 name="language" size={26} color="white" />
            )}
            onPress={onTranslate}
          />
        </Tooltip>

        <Tooltip title="Speak">
          <IconButton
            icon={() => (
              <Ionicons name="volume-high-outline" size={30} color="white" />
            )}
            onPress={onTextToSpeech}
          />
        </Tooltip>

        <Tooltip title="Full Screen">
          <IconButton
            icon={() => (
              <Entypo name="resize-full-screen" size={24} color="white" />
            )}
            onPress={onToggleFullScreen}
          />
        </Tooltip>
      </View>

      
    </View>
  );
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    width: "100%",
    paddingBottom: 10,
    elevation: 5,
  },
  appBar: {
    backgroundColor: "#1E293B",
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    width: "100%",
  },
  timeText: {
    color: "#ccc",
    fontSize: 12,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default ControlBar;
