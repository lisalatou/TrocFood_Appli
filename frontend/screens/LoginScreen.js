import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
import { colors, fonts } from "../theme";
import Feather from "react-native-vector-icons/Feather";
const adresseServeur = process.env.EXPO_PUBLIC_SERVER;

//Screen de connexion de l'utilisateur

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  const handleSignin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${adresseServeur}/users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.result) {
        dispatch(
          login({
            email: email,
            token: data.token,
            username: data.username,
            prenom: data.prenom,
          })
        );
        setEmail("");
        setPassword("");
        navigation.navigate("TabNavigator");
      } else {
        Alert.alert("Erreur", "Identifiants incorrects");
      }
    } catch (error) {
      Alert.alert("Erreur", "Problème de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoSection}>
            <Image
              source={require("../assets/TrocFoodLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.signupSection}>
            <TouchableOpacity
              onPress={handleSignup}
              style={styles.signupButton}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>Inscription</Text>
            </TouchableOpacity>
          </View>

          <View>
            <View style={styles.loginCard}>
              <View style={styles.loginHeader}>
                <View style={styles.loginIcon}>
                  <Feather name="log-in" size={15} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.loginTitle}>Connexion</Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputGroup}>
                  <View style={styles.inputHeader}>
                    <Feather name="mail" size={16} color={colors.primary} />
                    <Text style={styles.inputLabel}>Email</Text>
                  </View>
                  <TextInput
                    placeholder="votre@email.com"
                    placeholderTextColor={colors.primary + "60"}
                    onChangeText={setEmail}
                    value={email}
                    style={styles.input}
                    autoComplete="email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.separator} />

                <View style={styles.inputGroup}>
                  <View style={styles.inputHeader}>
                    <Feather name="lock" size={16} color={colors.primary} />
                    <Text style={styles.inputLabel}>Mot de passe</Text>
                  </View>
                  <TextInput
                    placeholder="Votre mot de passe"
                    placeholderTextColor={colors.primary + "60"}
                    onChangeText={setPassword}
                    value={password}
                    style={styles.input}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSignin}
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  logo: {
    width: 130,
    height: 130,
  },
  signupSection: {
    marginBottom: 30,
  },
  signupButton: {
    backgroundColor: colors.primary,
    borderRadius: 32,
    height: 50,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 18,
    overflow: "hidden",
    alignSelf: "center",
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: fonts.title,
    letterSpacing: 0.4,
  },

  loginCard: {
    backgroundColor: "white",
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
  loginHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  loginIcon: {
    width: 30,
    height: 30,
    borderRadius: 24,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 2,
    borderColor: colors.primary + "25",
  },
  //
  loginTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Merryweather",
    color: colors.primary,
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
    fontFamily: fonts.body,
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 16,
    padding: 13,
    fontSize: 16,
    fontFamily: "Poppins",
    color: colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.primary + "15",
    marginVertical: 16,
    borderRadius: 0.5,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 32,
    height: 50,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 18,
    width: "80%",
    overflow: "hidden",
    marginHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: fonts.title,
    letterSpacing: 0.4,
  },
});
