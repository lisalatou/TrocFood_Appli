import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { colors, fonts } from "../theme";
import Feather from "react-native-vector-icons/Feather";

// Screen pour afficher la liste des conversations, codé en dur.
// Navigation mise en place pour aller vers l'écran de chat en cliquant sur une conversation.

export default function ChatListScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleRow}>
        <Feather name="message-circle" size={26} color="#2F4934" />
        <Text style={styles.title}>Mes Conversations</Text>
      </View>
      <View style={styles.conversationList}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TabNavigator", { screen: "Chat" })
          }
        >
          <View style={styles.conversationItem}>
            <View style={styles.sousContainerItem}>
              <Image
                source={require("../assets/avatar2.png")}
                style={styles.avatar}
              />
              <View style={styles.textItemConversation}>
                <Text style={styles.user}>Flotch</Text>
                <Text style={styles.lastMessage}>Message</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={26} color="#cccdcf" />
          </View>
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
  // Container du titre
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  //  Style du texte du titre
  title: {
    fontSize: 24,
    fontWeight: fonts.title,
    color: colors.primary,
    marginLeft: 12,
  },

  // Container de la list des conversations
  conversationList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "white",
    margin: 30,
    borderRadius: 12,
    // Ombre iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Ombre Android
    elevation: 4,
  },

  // Item conversation
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Sous container de l'item conversation (Avatar+texte)
  sousContainerItem: {
    flexDirection: "row",
  },

  // Avatar
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textItemConversation: {
    display: "flex",
    flexDirection: "column",
  },

  // Nom utilisateur
  user: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    fontFamily: fonts.body,
    marginBottom: 4,
  },

  // Dernier message
  lastMessage: {
    fontSize: 14,
    color: colors.text1,
    fontFamily: fonts.body,
    lineHeight: 18,
  },

  // Flèche de retour
  fleche: {
    alignItems: "center",
    justifyContent: "center",
  },
});
