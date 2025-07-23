import React from "react";
import {
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import user, { login } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { colors, fonts } from "../theme";
import Feather from "react-native-vector-icons/Feather";

const adresseServeur = "http://172.20.10.2:3000";

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  // inscription au clic du user et redirection vers la page de création de profil
  const handleSubmit = () => {
    if (password !== checkPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Format d'email invalide");
      return;
    }

    // Validation du mot de passe
    if (password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    fetch(`${adresseServeur}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Réponse du serveur:", data); // Pour debug
        if (data.result) {
          alert("Inscription réussie");
          dispatch(login({ token: data.token, email: email }));
          setEmail("");
          setPassword("");
          setCheckPassword("");
          navigation.navigate("CreateProfile");
        } else {
          // Afficher le vrai message d'erreur du serveur
          alert(data.error || "Erreur lors de l'inscription");
        }
      })
      .catch((err) => {
        console.error("Erreur fetch inscription :", err);
        alert("Erreur de connexion au serveur");
      });
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../assets/TrocFoodLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.bottomTxt}>Rejoignez la communauté Troc'Food</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          onChangeText={(value) => setEmail(value)}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCorrect={false}
          style={styles.input}
        />
        <TextInput
          placeholder="Mot de passe"
          onChangeText={(value) => setPassword(value)}
          value={password}
          style={styles.input}
          secureTextEntry={true}
        />
        <TextInput
          placeholder="Confirmez le mot de passe"
          onChangeText={(value) => setCheckPassword(value)}
          value={checkPassword}
          style={styles.input}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text onPress={() => handleSubmit()} style={styles.textBtn}>
          C'est parti !
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF0",
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "white",
    width: "70%",
    padding: 10,
    margin: 10,
    alignSelf: "center",
    borderRadius: 15,
    fontFamily: fonts.body,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 15,
    marginTop: 20,
    width: "60%",
  },
  textBtn: {
    color: "white",
    fontFamily: fonts.body,
    fontSize: 14,
    textAlign: "center",
  },
  inputContainer: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    padding: 10,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary + "10",
  },
  bottomTxt: {
    fontFamily: fonts.body,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    color: colors.primary,
  },
});
