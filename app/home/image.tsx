import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { hp, wp } from "@/helpers/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { theme } from "@/constants/theme";
import { Entypo, Octicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams();
  const [status, setStatus] = React.useState("loading");
  let uri = item?.webformatURL;
  const fileName = item?.previewURL?.split("/").pop();
  const imageURL = uri;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  const onLoad = () => {
    setStatus("");
  };
  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;
    if (aspectRatio < 1) {
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    return { height: calculatedHeight, width: calculatedWidth };
  };
  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageURL, filePath);
      setStatus("");
      console.log("Finished downloading to ", uri);
      return uri;
    } catch (error) {
      console.log("Error downloading file", error.message);
      setStatus("");
      Alert.alert("Error", error.message);
      return null;
    }
  };
  const handleDownload = async () => {
    setStatus("downloading");
    let uri = await downloadFile();
    if (uri) {
      console.log("Downloaded");
    }
  };
  const handleShare = async () => {
    setStatus("sharing");
    let uri = await downloadFile();
    if (uri) {
      await Sharing.shareAsync(uri);
    }
  };
  return (
    <BlurView style={styles.container} intensity={60} tint="dark">
      <View style={getSize()}>
        <View style={styles.loading}>
          {status === "loading" && (
            <ActivityIndicator color="white" size="large" />
          )}
        </View>
        <Image
          style={[styles.image, getSize()]}
          source={uri}
          transition={100}
          onLoad={onLoad}
        />
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable
            style={styles.button}
            onPress={() => {
              router.back();
            }}
          >
            <Octicons name="x" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === "downloading" ? (
            <View style={styles.button}>
              <ActivityIndicator color="white" size="small" />
            </View>
          ) : (
            <Pressable onPress={handleDownload} style={styles.button}>
              <Octicons name="download" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status === "sharing" ? (
            <View style={styles.button}>
              <ActivityIndicator color="white" size="small" />
            </View>
          ) : (
            <Pressable onPress={handleShare} style={styles.button}>
              <Entypo name="share" size={22} color="white" />
            </Pressable>
          )}
        </Animated.View>
      </View>
    </BlurView>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  loading: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  buttons: {
    flexDirection: "row",
    gap: 50,
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
});
