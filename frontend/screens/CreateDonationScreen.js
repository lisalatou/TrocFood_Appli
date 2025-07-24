import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { addDon } from "../reducers/dons";
import { removePhoto } from "../reducers/photo";
import * as Location from "expo-location";
import { colors, fonts } from "../theme";
import Feather from "react-native-vector-icons/Feather";
const adresseServeur = process.env.EXPO_PUBLIC_SERVER;

//Screen de création d'un don

export default function CreateDonationScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const photoUri = useSelector((state) => state.photo?.value?.uri);

  // États du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  // Récupérer la position au chargement
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Fonction pour obtenir la position GPS
  const getCurrentLocation = async () => {
    // Demander la permission
    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Erreur", "Permission de localisation refusée");
      return;
    }

    // Obtenir la position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    if (location && location.coords) {
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } else {
      console.error("Erreur localisation: Position non disponible");
      Alert.alert("Erreur", "Impossible d'obtenir votre position");
    }
  };

  // Fonction pour créer le don
  const handleCreateDon = async () => {
    // Vérifications
    if (!user || !user.email) {
      Alert.alert("Erreur", "Vous devez être connecté");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un titre");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Erreur", "Veuillez entrer une description");
      return;
    }

    if (!userLocation) {
      Alert.alert("Erreur", "Position GPS non disponible");
      return;
    }

    // Préparer les données
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("latitude", userLocation.latitude.toString());
    formData.append("longitude", userLocation.longitude.toString());
    formData.append("user", user.email);

    // Ajouter l'image si elle existe
    if (photoUri) {
      formData.append("image", {
        uri: photoUri,
        type: "image/jpeg",
        name: "don-image.jpg",
      });
    }

    // Envoyer la requête
    const response = await fetch(`${adresseServeur}/dons`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.ok) {
      const result = await response.json();

      if (result.result) {
        // Succès
        dispatch(addDon(result.don));
        Alert.alert("Succès", "Votre don a été créé !", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("TabNavigator", { screen: "Home" }),
          },
        ]);

        // Réinitialiser le formulaire
        dispatch(removePhoto());
        setTitle("");
        setDescription("");
      } else {
        Alert.alert("Erreur", result.message || "Erreur lors de la création");
      }
    } else {
      console.error("Erreur réseau:", response.status);
      Alert.alert("Erreur", "Problème de connexion réseau");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Créer un don</Text>

        {/* Section photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo</Text>
          <TouchableOpacity
            style={styles.photoCard}
            onPress={() => navigation.navigate("Snap")}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Feather name="camera" size={50} color={colors.primary} />
                <Text style={styles.photoText}>Ajouter une photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Section informations */}
        <View style={styles.sectionInformation}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <Text style={styles.texte}>
            Ajoutez un titre permettant l'identification facile de votre don
            ainsi qu'une description avec par exemple: les ingrédients, les
            allergènes, est-ce végé...
          </Text>
          <Text style={styles.inputLabel}>Titre</Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Lasagnes maison"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />

          <Text style={styles.inputLabel}>Description</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Décrivez votre don..."
            value={description}
            onChangeText={setDescription}
            maxLength={200}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Bouton créer */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateDon}>
          <Text style={styles.createButtonText}>Créer le don</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: fonts.title,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 15,
    fontFamily: fonts.body,
  },
  sectionInformation: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  photoCard: {
    backgroundColor: "white",
    borderRadius: 10,
    height: 200,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#2F4934",
    borderStyle: "dotted",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photoText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.body,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary,
    marginBottom: 8,
    fontFamily: fonts.body,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: fonts.body,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 3,
  },
  texte: {
    marginBottom: 15,
    fontSize: 13,
    color: "black",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  createButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  createButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: fonts.body,
  },
  bottomSpace: {
    height: 50,
  },
});
