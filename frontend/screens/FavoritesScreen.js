import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../reducers/favorites";
import { colors, fonts } from "../theme";
import DonCard from "../components/DonCard";
const adresseServeur = "http://172.20.10.2:3000";

export default function FavoritesScreen({ navigation }) {
  const favorites = useSelector((state) => state.favorites.value); // Liste des favoris
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user._id); // ID utilisateur

  // Affichage des favoris :
  useEffect(() => {
    if (userId) {
      fetch(`${adresseServeur}/favorites/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            dispatch({
              type: "favorites/setFavorites",
              payload: data.favorites,
            });
          } else {
            console.log("❌ Erreur API:", data.message);
          }
        })
        .catch((error) => {
          console.error("❌ Erreur réseau favoris:", error);
        });
    }
  }, [userId, dispatch]);

  const handleToggleFavorite = (don) => {
    dispatch(toggleFavorite(don));
    if (userId) {
      fetch(`${adresseServeur}/favorites/${userId}/${don._id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.result) {
            console.log("✅ Favori supprimé du backend");
          } else {
            console.log("❌ Erreur suppression backend:", data.message);
          }
        })
        .catch((error) => {
          console.error("❌ Erreur réseau suppression:", error);
        });
    }
  };
  return (
    <View style={styles.container}>
      {/* LISTE SCROLLABLE DES FAVORIS */}
      <ScrollView contentContainerStyle={styles.cardsWrapper}>
        {/* AFFICHAGE CONDITIONNEL */}
        {favorites.length === 0 ? (
          // ÉTAT VIDE - Aucun favori
          <Text style={styles.emptyText}>Aucun favori pour l'instant.</Text>
        ) : (
          // LISTE DES FAVORIS
          favorites.map((favorite) => (
            <DonCard
              key={favorite._id}
              don={favorite}
              distance={favorite.distance}
              isFavorite={true} // Toujours true (on affiche que les favoris)
              onToggleFavorite={() => handleToggleFavorite(favorite)}
              onPress={
                () => navigation.navigate("Donation", { id: favorite._id }) // Navigation vers détails
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ONTENEUR PRINCIPAL
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 30,
  },

  // CARDS
  cardsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingBottom: 100,
    gap: 12,
    width: "100%",
    minHeight: 200,
    marginTop: 20,
  },

  // TEXTE ÉTAT VIDE
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text1,
    textAlign: "center",
    marginTop: 50,
    paddingHorizontal: 40,
    lineHeight: 24,
  },
});
