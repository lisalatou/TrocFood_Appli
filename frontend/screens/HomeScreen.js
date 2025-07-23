import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { colors, fonts } from "../theme";
import DonCard from "../components/DonCard";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../reducers/favorites";
import * as Location from "expo-location";
const adresseServeur = "http://172.20.10.2:3000";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();

  const [dons, setDons] = useState([]);
  const favorites = useSelector((state) => state.favorites?.value || []);
  const user = useSelector((state) => state.user?.value || {});
  const userId = user?._id;

  // Géolocatisation utilisateur
  const userLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission de géolocalisation refusée");
      return null;
    }
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  // Récupération des dons
  const fetchDons = async () => {
    const position = await userLocation();

    let url = `${adresseServeur}/dons`;
    if (position) {
      url += `?latitude=${position.latitude}&longitude=${position.longitude}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setDons(data.dons);
        } else {
          console.error("Erreur lors du chargement", data.message);
        }
      });
  };

  // Chargement des dons au montage du composant
  useEffect(() => {
    fetchDons();
  }, []);

  // Chargement des dons quand on revient sur la page
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchDons();
    });
    return unsubscribe;
  }, [navigation]);

  // Favoris
  const handleToggleFavorite = (don) => {
    dispatch(toggleFavorite(don));

    if (userId) {
      const isFav = favorites.some((fav) => fav._id === don._id);
      const method = isFav ? "DELETE" : "POST";
      const url = `${adresseServeur}/favorites/${userId}/${don._id}`;

      fetch(url, { method }).catch(console.error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {/* ScrollView */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => fetchDons()}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Liste des dons */}
        {dons.length > 0 ? (
          <View style={styles.donsContainer}>
            {dons.map((don) => (
              <View key={don._id} style={styles.donItem}>
                <DonCard
                  don={don}
                  distance={don.distance}
                  onPress={() =>
                    navigation.navigate("Donation", { id: don._id })
                  }
                  isFavorite={favorites.some((fav) => fav._id === don._id)}
                  onToggleFavorite={() => handleToggleFavorite(don)}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Feather name="search" size={32} color={colors.primary + "60"} />
            </View>
            <Text style={styles.emptyTitle}>Aucun don disponible</Text>
            <Text style={styles.emptySubtitle}>
              Soyez le premier à partager un délicieux plat !
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bouton flottant */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() =>
          navigation.navigate("TabNavigator", { screen: "CreateDonation" })
        }
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonText}>Je veux donner !</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // STRUCTURE PRINCIPALE
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  // DONS CONTAINER
  donsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  donItem: {
    width: "47%",
    marginBottom: 15,
  },

  // EMPTY STATE
  emptyContainer: {
    alignItems: "center",
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + "12",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.primary + "25",
    borderStyle: "dashed",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    fontFamily: fonts.title,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.primary + "70",
    fontFamily: fonts.body,
    textAlign: "center",
    lineHeight: 20,
  },

  // BOUTON FLOTTANT
  floatingButton: {
    position: "absolute",
    bottom: 50,
    left: 24,
    right: 24,
    backgroundColor: colors.primary,
    borderRadius: 32,
    height: 68,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingButtonText: {
    color: "white",
    fontSize: 19,
    fontWeight: "700",
    fontFamily: fonts.title,
    letterSpacing: 0.4,
  },

  // LOADING & ERROR
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.primary,
    marginTop: 10,
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "#fff3f3",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  errorText: {
    color: "#d8000c",
    fontFamily: fonts.body,
    textAlign: "center",
    fontSize: 14,
  },
  bottomSpacing: {
    height: 140,
  },
});
