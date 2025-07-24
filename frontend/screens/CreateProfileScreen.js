import React from "react";
import { useState } from "react";
import {
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shadow } from "react-native-shadow-2";
import { updateEmail, signUp } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import {
  AutocompleteDropdown,
  AutocompleteDropdownContextProvider,
} from "react-native-autocomplete-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Feather from "react-native-vector-icons/Feather";
import { colors, fonts } from "../theme";
const adresseServeur = process.env.EXPO_PUBLIC_SERVER;

//Screen permettant de compléter son profil utilisateur une fois le mail et le mdp enregistré

export default function CreateProfileScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const [pseudo, setPseudo] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState(user.email);
  const [telephone, setTelephone] = useState("");

  // États pour gérer la date de naissance
  const [date, setDate] = useState(new Date()); // date de naissance en Date afin que le DateTimePicker puisse fonctionner
  const [finaleDate, setFinaleDate] = useState(""); // date de naissance formatée pour l'affichage sur l'input, car en format Date, l'input ne l'affiche pas

  // Les états pour  gérer l'adresse
  const [adress, setAdress] = useState({ name: "", city: "" }); // valeur initiale de l'adresse, qui, une fois la sélection de l'adresse faite, deviendra un objet avec la réponse de l'API adresse.data.gouv.fr
  const [dataAdresses, setDataAdresses] = useState([]);
  const [dataSet, setDataSet] = useState([]);
  const [dataAdress, setDataAdress] = useState({});

  // État pour gérer la visibilité du sélecteur de date
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const dispatch = useDispatch();

  const searchAdress = (query) => {
    // Prevent search with an empty query
    if (query.length < 3) {
      return;
    }

    fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}`)
      .then((response) => response.json())
      // features est un tableau d'objets avec toutes les adresses possibles
      .then(({ features }) => {
        const suggestions = features?.map((data, i) => {
          return {
            id: data.properties.id,
            name: data.properties.name,
            city: data.properties.city,
          };
        });
        // DataSet est un tableau d'objets avec toutes les adresses simplifiées pour l'affichage
        setDataSet(suggestions);
        //DataAdresses est un tableau d'objets avec les réponses de l'API complètes
        setDataAdresses(features);
      });
  };

  // au clic sur le bouton 'Enregistrer', requête de la route POST /users/profiles
  const handleSubmit = () => {
    console.log({
      email,
      pseudo,
      prenom,
      nom,
      telephone,
      dataAdress,
      token: user.token,
      birthday: date,
    });
    fetch(`${adresseServeur}/users/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        userName: pseudo,
        firstName: prenom,
        lastName: nom,
        phone: telephone,
        address: dataAdress,
        token: user.token,
        birthday: date,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.result) {
          console.log(data.error);
          return alert(data.error);
        } else {
          console.log(data);
          dispatch(
            signUp({
              username: data.user.userName,
              prenom: data.user.firstName,
            })
          );

          //si l'email a changé (faute de frappe par exemple), on met à jour le reducer
          if (user.email !== email) {
            dispatch(updateEmail({ email }));
          }
          navigation.navigate("TabNavigator");
        }
      });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Fonction pour changer la valeur de la date avec celle qu'on a sélectionnée
  const handleConfirm = (date) => {
    setDate(date);
    setFinaleDate(date.toLocaleDateString("fr-FR")); // Formatage de la nouvelle date sous cette forme JJ/MM/AAAA
    hideDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.body}>
            <Text style={styles.headerText}>Complétez votre profil :</Text>
            <TextInput
              placeholder="Pseudo"
              onChangeText={setPseudo}
              value={pseudo}
              style={styles.inputContainer}
            />
            <TextInput
              placeholder="Prénom"
              onChangeText={setPrenom}
              value={prenom}
              style={styles.inputContainer}
            />
            <TextInput
              placeholder="Nom de famille"
              onChangeText={setNom}
              value={nom}
              style={styles.inputContainer}
            />

            {/* DATE DE NAISSANCE */}
            <View style={styles.calendarLine}>
              <TextInput
                value={finaleDate}
                placeholder="Date de naissance"
                editable={false}
                style={styles.inputContainerdate}
                placeholderTextColor={colors.primary}
                pointerEvents="none"
              />
              <TouchableOpacity activeOpacity={0.8} onPress={showDatePicker}>
                <Feather name="calendar" size={35} color={colors.primary} />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                textColor="black"
              />
            </View>
            {/* FIN DE DATE DE NAISSANCE */}

            <TextInput
              placeholder="email"
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              autoCorrect={false}
              style={styles.inputContainer}
            />

            {/* ADRESSE AVEC SUGGESTION */}
            <View style={styles.addressZone}>
              <AutocompleteDropdownContextProvider>
                <AutocompleteDropdown
                  onChangeText={(value) => {
                    setAdress(value);
                    searchAdress(value);
                  }}
                  onSelectItem={(item) => {
                    // console.log(item);
                    item && setAdress(`${item.name}, ${item.city}`);
                    item &&
                      setDataAdress(
                        dataAdresses.find(
                          (data) => data.properties.id === item.id
                        )
                      );
                  }}
                  dataSet={dataSet}
                  textInputProps={{
                    placeholder: "Adresse",
                    value: adress,
                    style: { color: colors.text1 },
                  }}
                  inputContainerStyle={styles.AdresseInputContainer}
                  suggestionsListContainerStyle={styles.suggestionListContainer}
                  containerStyle={styles.dropdownContainer}
                  renderItem={(item) => {
                    return (
                      <View style={styles.suggestionItem}>
                        <Text style={styles.suggestionListText}>
                          {item.name}, {item.city}
                        </Text>
                      </View>
                    );
                  }}
                  flatListProps={{
                    keyboardShouldPersistTaps: "always",
                    nestedScrollEnabled: true,
                    scrollEnabled: false, // <- important pour éviter les conflits ScrollView
                  }}
                  closeOnSubmit
                  direction="up"
                />
              </AutocompleteDropdownContextProvider>
            </View>
            {/* FIN ADRESSE AVEC SUGGESTION */}

            <TextInput
              placeholder="Téléphone"
              onChangeText={setTelephone}
              value={telephone}
              style={styles.inputContainer}
            />

            <TouchableOpacity style={styles.btnSubmit}>
              <Text onPress={handleSubmit} style={styles.textBtn}>
                Enregistrer
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    alignItems: "center",
    margin: 40,
  },
  headerText: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: colors.primary,
    fontWeight: 700,
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: "white",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: fonts.body,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 3,
  },
  calendarLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  inputContainerdate: {
    backgroundColor: "white",
    width: "80%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: fonts.body,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 3,
  },
  addressZone: {
    flexDirection: "row",
  },
  AdresseInputContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: fonts.body,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 3,
  },
  suggestionListContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginTop: 4,
    maxHeight: 200,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: "80%",
    alignSelf: "flex-start",
  },
  suggestionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  suggestionListText: {
    fontSize: 15,
    color: colors.text1 || "#333",
    fontFamily: fonts.body,
  },
  dropdownContainer: {},

  btnSubmit: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    width: "50%",
    marginTop: 20,
    paddingVertical: 10,
  },
  textBtn: {
    fontFamily: fonts.body,
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
