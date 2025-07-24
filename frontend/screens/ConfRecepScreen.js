import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { colors, fonts } from "../theme";
const adresseServeur = process.env.EXPO_PUBLIC_SERVER;

// Screen pour confirmer la réception d'un don et lors de la confirmation,
// supprimer le don de la base de données.

export default function ConfRecepScreen({ navigation, route }) {
  const { id, userName } = route.params;

  // Supprimer le don
  const handleDelete = () => {
    fetch(`${adresseServeur}/dons/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          navigation.navigate("TabNavigator", {
            screen: "Home",
            refresh: true,
          });
        } else {
          console.error("Erreur lors de la suppression du don :", data.message);
        }
      })
      .catch((error) => {
        console.error("Erreur réseau :", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerAvatar}>
        <Image
          source={require("../assets/avatar2.png")}
          style={styles.avatar}
        />
        <Image
          source={require("../assets/avatar1.png")}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.textRemerciement}>{userName} vous remercie !</Text>

      <View style={styles.containerStats}>
        <Text style={styles.textContainerStats}>
          Vous avez sauvé 150 grammes de nourriture ! BRAVO !
        </Text>
        <View style={styles.emoticonsContainer}>
          <Image
            source={require("../assets/applaudissements.png")}
            style={styles.emoticons}
          />
          <Image
            source={require("../assets/fete.png")}
            style={styles.emoticons}
          />
        </View>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.textBtn}>Évaluer {userName}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleDelete}>
          <Text style={styles.textBtn}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerAvatar: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textRemerciement: {
    fontFamily: fonts.bodyBold,
    fontSize: 24,
    color: colors.primary,
    textAlign: "center",
    marginTop: 20,
  },
  containerStats: {
    backgroundColor: "white",
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
    borderRadius: 12,
    // Ombre iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Ombre Android
    elevation: 4,
  },

  textContainerStats: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text1,
    textAlign: "center",
  },
  emoticonsContainer: {
    flexDirection: "row",
    justifyContent: "center",

    marginTop: 10,
  },
  emoticons: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
    // borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "column",
    marginTop: 10,
  },

  btn: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    borderRadius: 25,
    height: 55,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,

    // Ombre IOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,

    // Ombre Android
    elevation: 10,
  },
  textBtn: {
    fontFamily: fonts.body,
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
});
