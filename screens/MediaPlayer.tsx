import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import AppbarHeader from "../assets/components/AppbarHeader";
import ControlBar from "../assets/components/ControlBar";
import { Asset } from "expo-asset";
import Slider from "@react-native-community/slider";

const DEFAULT_VIDEO = require("../assets/Video/defaultvideo.mp4");
const BACKEND_URL = Platform.select({
  android: "http://10.0.2.2:8000/translate-video",
  ios: "http://localhost:8000/translate-video",
  default: "http://localhost:8000/translate-video",
});

const MediaPlayer: React.FC = () => {
  const videoRef = useRef<Video>(null);

  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [subtitles, setSubtitles] = useState("");
  const [duration, setDuration] = useState(1);
  const [playTime, setPlayTime] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isDefaultVideo, setIsDefaultVideo] = useState(true);

  // Load default video URI on mount
  useEffect(() => {
    (async () => {
      try {
        const asset = Asset.fromModule(DEFAULT_VIDEO);
        const uri = asset.localUri || asset.uri;
        setMediaUri(uri);
        setIsDefaultVideo(true);
      } catch (err) {
        Alert.alert("Error", "Failed to load default video");
      }
    })();
  }, []);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    const status = await videoRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handleSeek = async (time: number) => {
    if (!videoRef.current) return;

    const status = await videoRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    await videoRef.current.setPositionAsync(time * 1000);
    setPlayTime(time);

    // If playing, resume after seek
    if (isPlaying) {
      await videoRef.current.playAsync();
    }
  };

  const toggleRepeat = () => setIsRepeat((prev) => !prev);

  const handleFullscreenToggle = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.presentFullscreenPlayer();
      } catch (e) {
        console.warn("Fullscreen failed:", e);
      }
    }
  };

  // Placeholder: Replace with real file picker
  const pickMedia = async () => {
    Alert.alert("Pick media function not implemented yet.");
    // Example:
    // const pickedUri = await yourFilePickerFunction();
    // if (pickedUri) {
    //   setMediaUri(pickedUri);
    //   setIsDefaultVideo(false);
    //   setSubtitles("");
    // }
  };

  // Send current video to backend for translation
  const translateVideo = async () => {
    if (!mediaUri) {
      Alert.alert("No video loaded", "Please load a video first.");
      return;
    }

    setIsLoading(true);
    setSubtitles("");

    // On iOS file:// prefix must be removed; Android needs it
    const formattedUri =
      Platform.OS === "ios" ? mediaUri.replace("file://", "") : mediaUri;

    const formData = new FormData();
    formData.append("file", {
      uri: formattedUri,
      type: "video/mp4",
      name: "video.mp4",
    } as any);

    try {
      const response = await fetch(BACKEND_URL!, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();

      // Backend returns translatedText key (case sensitive!)
      setSubtitles(data.translatedText || "No subtitles returned");
    } catch (error: any) {
      Alert.alert("Translation failed", error.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <AppbarHeader
          isPlaying={isPlaying}
          onTogglePlayPause={handlePlayPause}
          onSearchPress={pickMedia}
          isTranslating={isLoading}
          onToggleTranslation={translateVideo}
        />

        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={mediaUri ? { uri: mediaUri } : undefined}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={isPlaying}
            onLoad={(status) => {
              if (status.isLoaded) {
                setDuration(status.durationMillis! / 1000);
              }
            }}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded) {
                setPlayTime(status.positionMillis / 1000);
                if (status.didJustFinish && isRepeat) {
                  videoRef.current?.setPositionAsync(0);
                  videoRef.current?.playAsync();
                }
              }
            }}
          />
          {isLoading && (
            <ActivityIndicator
              size="large"
              color="#1DB954"
              style={styles.loading}
            />
          )}
        </View>

        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitleText}>{subtitles}</Text>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={{ width: "100%" }}
            minimumValue={0}
            maximumValue={duration}
            value={playTime}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#ffffff"
            thumbTintColor="#1DB954"
            onSlidingComplete={handleSeek}
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>
              {new Date(playTime * 1000).toISOString().substr(14, 5)}
            </Text>
            <Text style={styles.timeText}>
              {new Date(duration * 1000).toISOString().substr(14, 5)}
            </Text>
          </View>
        </View>

        <ControlBar
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onPickMedia={pickMedia}
          playTime={playTime}
          duration={duration}
          onSeek={handleSeek}
          isRepeat={isRepeat}
          onToggleRepeat={toggleRepeat}
          onToggleFullScreen={handleFullscreenToggle}
          onTranslate={translateVideo}
          onSpeechToText={() => {}}
          onTextToSpeech={() => {}}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    maxWidth: 500,
    height: 590,
    borderRadius: 10,
  },
  loading: {
    position: "absolute",
  },
  subtitleContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 8,
  },
  subtitleText: {
    color: "white",
    fontSize: 16,
  },
  sliderContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "white",
    fontSize: 14,
  },
});

export default MediaPlayer;
