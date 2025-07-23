import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useDispatch } from "react-redux";
import { addPhoto } from "../reducers/photo";
import Feather from "react-native-vector-icons/Feather";
import { useIsFocused } from "@react-navigation/native";
import { colors, fonts } from "../theme";

export default function SnapScreen({ navigation }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [facing, setFacing] = useState("back");
  const [flashMode, setFlashMode] = useState("off");

  // Demande de permission caméra
  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result?.status === "granted");
    })();
  }, []);

  // Caméra avant/arrière
  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  // Flash on/off
  const toggleFlashStatus = () => {
    setFlashMode((prev) => (prev === "off" ? "on" : "off"));
  };

  // 📸 Prendre une photo
  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      // 📷 Capture avec qualité optimisée
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8, // Qualité 80%
        base64: false, // Pas de base64 (plus léger)
        skipProcessing: true, // Pas de traitement supplémentaire
      });

      // Sauvegarder dans Redux store
      dispatch(addPhoto({ uri: photo.uri }));

      // Naviguer vers l'écran de création de don
      navigation.navigate("CreateDonation");
    } catch (error) {
      console.error("Erreur prise photo:", error);
    }
  };

  // Écran de permission si pas d'accès caméra ou écran pas focus
  if (!hasPermission || !isFocused) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Accès à la caméra requis</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Vue caméra principale */}
      <CameraView
        style={styles.camera}
        type={facing}
        flashMode={flashMode}
        ref={cameraRef}
      />

      {/* Contrôles en haut (retour, flash, rotation) */}
      <SafeAreaView style={styles.controls}>
        {/* Bouton retour */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        {/* Bouton flash (jaune si activé) */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleFlashStatus}
        >
          <Feather
            name="zap"
            size={24}
            color={flashMode === "on" ? "#FFD700" : "white"}
          />
        </TouchableOpacity>

        {/* Bouton rotation caméra */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleCameraFacing}
        >
          <Feather name="rotate-cw" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bouton de capture en bas */}
      <View style={styles.snapContainer}>
        <TouchableOpacity style={styles.snapButton} onPress={takePicture}>
          <View style={styles.snapInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },

  // Container permission refusée
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.body,
    textAlign: "center",
  },

  // Barre de contrôles en haut
  controls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  // Boutons de contrôle individuels
  controlButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 22,
  },

  // Container du bouton de capture
  snapContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  // Bouton
  snapButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "white",
  },

  // Cercle blanc intérieur du bouton
  snapInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
});
