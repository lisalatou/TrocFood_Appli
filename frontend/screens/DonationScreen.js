import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { colors, fonts } from "../theme";
const adresseServeur = "http://172.20.10.2:3000";

export default function DonationScreen({ route, navigation }) {
  const { id } = route.params;
  const [don, setDon] = useState(null);

  //Chargement des données du don
  useEffect(() => {
    fetch(`${adresseServeur}/dons/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setDon(data.don);
        }
      });
  }, [id]);

  if (!don)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Don non trouvé</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* IMAGE DU PLAT */}
        <View style={styles.imageContainer}>
          {don.image ? (
            <Image
              source={{ uri: don.image }} // ← URL Cloudinary depuis MongoDB
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Feather name="image" size={48} color={colors.primary} />
              <Text style={styles.noImageText}>Aucune image disponible</Text>
            </View>
          )}
        </View>

        {/* CONTENU PRINCIPAL */}
        <View style={styles.contentContainer}>
          {/* Titre du plat */}
          <Text style={styles.title}>{don.title}</Text>

          {/* CARTE UTILISATEUR */}
          <View style={styles.userCard}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(() => {
                    const userName = don?.user?.userName;
                    return userName.charAt(0).toUpperCase();
                  })()}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userTitle}>Proposé par</Text>
                <Text style={styles.userName}>
                  {don?.user?.userName || "Utilisateur anonyme"}
                </Text>
              </View>
            </View>
          </View>

          {/* CARTE DATE */}
          <View style={styles.dateCard}>
            <View style={styles.dateContainer}>
              <Feather name="calendar" size={16} color={colors.primary} />
              <Text style={styles.dateText}>
                {(() => {
                  // Essayer différents champs de date possibles
                  const date =
                    don?.date ||
                    don?.createdAt ||
                    don?.dateCreated ||
                    don?.timestamp;
                  return date
                    ? `Publié le ${new Date(date).toLocaleDateString("fr-FR")}`
                    : "Date non disponible";
                })()}
              </Text>
            </View>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{don.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* BOUTON D'ACTION FLOTTANT */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            const dataToSend = {
              id: don?._id,
              title: don?.title || "Plat sans nom",
              description: don?.description || "Aucune description disponible",
              image: don?.image || null,
              userName: don?.user?.userName || null,
            };

            console.log("Data to send:", dataToSend);
            navigation.navigate("TabNavigator", {
              screen: "Chat",
              params: {
                additionnalData: dataToSend,
              },
            });
          }}
        >
          <Text style={styles.actionButtonText}>Je veux ce plat !</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // CONTENEURS PRINCIPAUX
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Espace pour le bouton flottant
  },

  // ÉTATS DE CHARGEMENT
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text1,
    fontFamily: fonts.body,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error || "#FF0000",
    textAlign: "center",
    fontFamily: fonts.body,
  },

  // IMAGE DU PRODUIT
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: colors.message,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.message,
  },
  noImageText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.body,
  },

  // TITRE ET TEXTES
  title: {
    fontSize: 24,
    fontWeight: fonts.title,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text1,
    fontFamily: fonts.body,
    textAlign: "justify",
  },

  // CARTES D'INFORMATION (style uniforme)
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primary + "10",
  },
  dateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primary + "10",
    alignItems: "center",
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primary + "10",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bodyBold,
    color: colors.primary,
    marginBottom: 16,
  },

  // ÉLÉMENTS UTILISATEUR
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    color: colors.text2,
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: fonts.bodyBold,
  },
  userDetails: {
    flex: 1,
  },
  userTitle: {
    fontSize: 14,
    color: colors.text1,
    fontFamily: fonts.body,
    marginBottom: 6,
  },
  userName: {
    fontSize: 18,
    color: colors.primary,
    fontFamily: fonts.bodyBold,
  },

  // ÉLÉMENTS DATE
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: colors.text1,
    fontFamily: fonts.body,
    marginLeft: 8,
  },

  // BOUTON D'ACTION FLOTTANT
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: 20,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 9999, // Bouton totalement arrondi
    height: 55,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text2,
  },
});
