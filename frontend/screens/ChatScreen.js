import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Pusher from "pusher-js";
import { colors, fonts } from "../theme";

const adresseServeur = process.env.EXPO_PUBLIC_SERVER;

// Screen du chat en temps réel avec Pusher(service de messagerie en temps réel).

// Configuration de Pusher pour recevoir les messages en temps réel.
const pusher = new Pusher("804a507f9c5eb9b9ac46", { cluster: "eu" });

export default function ChatScreen({ navigation, route }) {
  // Récupérer les paramètres de la conversation depuis la navigation (depuis l'écran précédent).
  const { additionnalData } = route.params || {};

  // États locaux des composants :
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  // Récupération des données de l'utilisateur connecté depuis le store Redux.
  const user = useSelector((state) => state.user.value);
  const [userName, setUserName] = useState("");

  // Fonction appelée quand un message arrive via Pusher.
  const handleReceiveMessage = (data) => {
    // Ajout du nouveau message à la liste existante.
    setMessages((messages) => [...messages, data]);
  };

  const [keyboardStatus, setKeyboardStatus] = useState("Keyboard Hidden");

  // Hook useEffect qui s'exécute une seule fois au chargement du composant.
  useEffect(() => {
    let channel; // Variable pour stocker le canal Pusher.
    let currentUserName = ""; // Nom de l'utilisateur pour le nettoyage.

    // Récupération des informations de l'utilisateur connecté via son token(qui est stocké dans le store Redux).
    fetch(`${adresseServeur}/chat/usersInfo/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        // Mise à jour du nom de l'utilisateur dans l'état local.
        setUserName(data.userName);
        currentUserName = data.userName;

        // Connexion de l'utilisateur au chat.
        fetch(`${adresseServeur}/chat/users/${data.userName}`, {
          method: "PUT",
        });

        // Abonnement au canal de chat pour pouvoir recevoir les messages.
        channel = pusher.subscribe("chat");
        // Quand l'abonnement est réussi, on écoute les messages. Quand un message est reçu, on appelle la fonction handleReceiveMessage.
        channel.bind("pusher:subscription_succeeded", () => {
          channel.bind("message", handleReceiveMessage);
        });
      });

    // Fonction de nettoyage : s'éxécute quand le composant est démonté.)
    return () => {
      // Se désabonne des évènements Pusher.
      if (channel) {
        channel.unbind("message", handleReceiveMessage);
        pusher.unsubscribe("chat");
      }
      // Déconnexion de l'utilisateur côté serveur.
      if (currentUserName) {
        fetch(`${adresseServeur}/chat/users/${currentUserName}`, {
          method: "DELETE",
        });
      }
    };
  }, []);

  // Gestion du status du clavier pour le conditionnel de style
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardStatus("Keyboard Shown");
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardStatus("Keyboard Hidden");
      }
    );

    return () => {
      // Nettoyage des listeners du clavier.
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Fonction pour envoyer un message.
  const handleSendMessage = () => {
    // Vérification que le message n'est pas vide.
    if (!messageText) {
      return;
    }
    // Création de l'objet message à envoyer.
    const payload = {
      from: userName,
      content: messageText,
      date: new Date(),
    };
    // Envoi du message au serveur.
    fetch(`${adresseServeur}/chat/message/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // Vide le champ de saisie après l'envoi du message.
    setMessageText("");
  };

  return (
    <View
      style={
        keyboardStatus === "Keyboard Shown"
          ? styles.KeyboardView
          : styles.container
      }
    >
      <View style={styles.banner}>
        <Text style={styles.greetingText}></Text>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.BtnReserver}
            // Navigation vers l'écran de réservation avec transmission des données.
            onPress={() =>
              navigation.navigate("TabNavigator", {
                screen: "ConfResa",
                params: {
                  additionnalData: additionnalData,
                },
              })
            }
          >
            <Text style={styles.textBtn}>Réserver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.BtnSignaler}>
            <Text style={styles.textBtn}>Signaler</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inset}>
        <ScrollView style={styles.scroller}>
          {messages.map((message, i) => (
            <View
              key={i}
              style={[
                //style conditionnel : pour aligner les messages à gauche ou à droite.
                styles.messageWrapper,
                {
                  ...(message.from === userName
                    ? styles.messageSent
                    : styles.messageRecieved),
                },
              ]}
            >
              <View
                style={[
                  //style conditionnel : pour changer la couleur de fond des messages.
                  styles.message,
                  {
                    ...(message.from === userName
                      ? styles.messageSentBg
                      : styles.messageRecievedBg),
                  },
                ]}
              >
                <Text style={styles.messageText}>{message.content}</Text>
              </View>
              {/* Affichage de l'heure du message */}
              <Text style={styles.timeText}>
                {new Date(message.date).getHours()}:
                {String(new Date(message.date).getMinutes()).padStart(2, "0")}
              </Text>
            </View>
          ))}
        </ScrollView>
        {/* Zone de saisie des messages avec boutons envoyer */}
        <View style={styles.inputbtnContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={(value) => setMessageText(value)}
              value={messageText}
              style={styles.input}
              placeholder="Écris un message..."
              autoFocus
            />
          </View>
          <View style={styles.btnSendContainer}>
            <TouchableOpacity>
              <Feather name="camera" size={36} color="#2F4934" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSendMessage()}
              style={styles.sendButton}
            >
              <Feather name="send" size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container principal :
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFaf0",
  },
  KeyboardView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFaf0",
    paddingBottom: 275, // Ajout d'un padding pour éviter que le clavier cache les éléments
  },
  // Style de la Bannière du haut de l'écran :
  banner: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 7,
  },
  greetingText: {
    color: colors.primary,
    fontWeight: "regular",
    fontSize: 16,
    paddingBottom: 1,
  },
  btnContainer: {
    flexDirection: "row",
    gap: 60, // Gap = espace entre les boutons
  },
  BtnReserver: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    padding: 10,
    paddingLeft: 40,
    paddingRight: 40,
  },
  BtnSignaler: {
    backgroundColor: colors.accent2,
    borderRadius: 25,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  textBtn: {
    fontFamily: fonts.body,
    fontWeight: "500",
    fontSize: 12,
    color: "white",
  },

  // Style de la zone de chat :
  inset: {
    flex: 1,
    backgroundColor: "#FFFaf0",
    width: "95%",
    paddingTop: 20,
    borderTopColor: "#2F4934",
    borderTopWidth: 1.5,
  },
  // Styles des bulles des messages :
  message: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 24,
    alignItems: "flex-end",
    justifyContent: "center",
    maxWidth: "65%",
  },
  messageWrapper: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  messageRecieved: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  messageSent: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageSentBg: {
    backgroundColor: colors.message2,
  },
  messageRecievedBg: {
    backgroundColor: colors.message,
  },
  messageText: {
    color: "#506568",
    fontWeight: "400",
  },
  timeText: {
    color: "#506568",
    opacity: 0.5,
    fontSize: 10,
    marginTop: 2,
  },
  scroller: {
    paddingLeft: 20,
    paddingRight: 20,
  },

  // Container Input avec bouton send:
  inputbtnContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    padding: 14,
    borderRadius: 8,
    shadowColor: "#000",
    borderColor: "black",
    borderWidth: 1,
  },
  btnSendContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    alignItems: "center",
  },
  sendButton: {
    borderRadius: 25,
    paddingRight: 30,
    paddingLeft: 30,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
