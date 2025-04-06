import React, { useState, useRef, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Video, Audio, ResizeMode } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import AppbarHeader from "../components/AppbarHeader";
import ControlBar from "../components/ControlBar";

const DEFAULT_VIDEO = require("../Video/defaultvideo.mp4");
const DEFAULT_AUDIO = require("../Audio/defaultaudio.mp3");

const MediaPlayer: React.FC = () => {
  const videoRef = useRef<Video>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const [mediaUri, setMediaUri] = useState<any>(DEFAULT_VIDEO);
  const [mediaType, setMediaType] = useState<"audio" | "video">("video");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isRepeat, setIsRepeat] = useState(false);

  // Load media when URI or type changes
  useEffect(() => {
    const setup = async () => await loadMedia();
    setup();
    return () => {
      const cleanup = async () => await unloadMedia();
      cleanup();
    };
  }, [mediaUri, mediaType]);

  const loadMedia = async () => {
    setIsLoading(true);
    if (mediaType === "audio") {
      if (soundRef.current) await soundRef.current.unloadAsync();
      const { sound } = await Audio.Sound.createAsync(
        mediaUri.uri ? { uri: mediaUri.uri } : mediaUri,
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setPlayTime(status.positionMillis / 1000);
            setDuration(status.durationMillis! / 1000);
            if (status.didJustFinish && isRepeat) {
              sound.setPositionAsync(0);
              sound.playAsync();
            }
          }
        }
      );
      soundRef.current = sound;
    }
    setIsLoading(false);
  };

  const unloadMedia = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const pickMedia = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["audio/*", "video/*"],
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const type = asset.mimeType?.startsWith("audio") ? "audio" : "video";
      setMediaUri({ uri });
      setMediaType(type);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = async () => {
    if (mediaType === "video" && videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        isPlaying
          ? await videoRef.current.pauseAsync()
          : await videoRef.current.playAsync();
        setIsPlaying(!isPlaying);
      }
    } else if (mediaType === "audio" && soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        isPlaying
          ? await soundRef.current.pauseAsync()
          : await soundRef.current.playAsync();
        setIsPlaying(!isPlaying);
      }
    }
  };

  const handleSeek = async (time: number) => {
    if (mediaType === "video" && videoRef.current) {
      await videoRef.current.setPositionAsync(time * 1000);
    } else if (mediaType === "audio" && soundRef.current) {
      await soundRef.current.setPositionAsync(time * 1000);
    }
    setPlayTime(time);
  };

  const handleToggleRepeat = () => setIsRepeat((prev) => !prev);

  const handleFullscreenToggle = async () => {
    if (mediaType === "video" && videoRef.current) {
      try {
        await videoRef.current.presentFullscreenPlayer();
      } catch (err) {
        console.warn("Failed to enter fullscreen:", err);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        {/* Header */}
        <AppbarHeader
          isPlaying={isPlaying}
          onTogglePlayPause={handlePlayPause}
          onSearchPress={pickMedia}
          isTranslating={false}
          onToggleTranslation={() => {}}
        />

        {/* Media Display */}
        <View className="flex-1 justify-center items-center">
          {mediaType === "video" ? (
            <Video
              ref={videoRef}
              source={mediaUri}
              style={{
                width: "100%",
                maxWidth: 500,
                height: 614,
                borderRadius: 10,
              }}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={isPlaying}
              onLoadStart={() => setIsLoading(true)}
              onLoad={(status) => {
                if (status.isLoaded && status.durationMillis != null) {
                  setDuration(status.durationMillis / 1000);
                }
                setIsLoading(false);
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
          ) : (
            <Text className="text-white text-lg">🎧 Playing Audio...</Text>
          )}
          {isLoading && <ActivityIndicator size="large" color="#1DB954" />}
        </View>

        {/* Control Bar */}
        <View className="w-full">
          <ControlBar
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onPickMedia={pickMedia}
            playTime={playTime}
            duration={duration}
            onSeek={handleSeek}
            isRepeat={isRepeat}
            onToggleRepeat={handleToggleRepeat}
            onSpeechToText={() => {}}
            onTranslate={() => {}}
            onTextToSpeech={() => {}}
            onToggleFullScreen={handleFullscreenToggle}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MediaPlayer;
