import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors, fonts } from "../theme";

//Screen confirmant la réservation d'un don

export default function ConfResaScreen({ route, navigation }) {
  const { additionnalData } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: additionnalData.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* CARTE UTILISATEUR */}
        <View style={styles.userCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(additionnalData?.userName || "U").charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userTitle}>Vous êtes en relation avec :</Text>
              <Text style={styles.userName}>
                {additionnalData?.userName || "Utilisateur anonyme"}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <TouchableOpacity style={styles.perduButton}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.actionButtonText}>Je suis perdu.e</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("TabNavigator", {
                screen: "ConfRecep",
                params: {
                  id: additionnalData.id,
                  userName: additionnalData.userName,
                },
              })
            }
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.actionButtonText}>
                Je confirme la réception du plat
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 160,
  },
  imageContainer: {
    width: "80%",
    height: 300,
    backgroundColor: colors.message,
    alignSelf: "center",
    borderRadius: 15,
    marginTop: 20,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    width: "80%",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primary + "10",
    alignSelf: "center",
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
  // BOUTON D'ACTION FLOTTANT
  perduButton: {
    width: "80%",
    backgroundColor: colors.accent2,
    borderRadius: 9999, // Bouton totalement arrondi
    height: 55,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    alignSelf: "center",
  },
  actionButton: {
    width: "80%",
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
    alignSelf: "center",
  },
  actionButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text2,
  },
});
