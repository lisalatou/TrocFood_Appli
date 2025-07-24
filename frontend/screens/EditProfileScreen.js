import React from "react";
import { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import user, { updateEmail } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  AutocompleteDropdown,
  AutocompleteDropdownContextProvider,
} from "react-native-autocomplete-dropdown";
import { colors, fonts } from "../theme";
import Feather from "react-native-vector-icons/Feather";
const adresseServeur = process.env.EXPO_PUBLIC_SERVER;

//Screen permettant à un utilisateur de modifier ses informations perso

export default function EditProfileScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const [pseudo, setPseudo] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState(user.email);
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [birthdayVisible, setBirthdayVisible] = useState("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [adress, setAdress] = useState("");
  const [dataAdresses, setDataAdresses] = useState([]);
  const [dataSet, setDataSet] = useState([]);
  const [dataAdress, setDataAdress] = useState({});

  const dispatch = useDispatch();

  //requête la route GET /users/profile
  useEffect(() => {
    fetch(`${adresseServeur}/users/profile/${user.token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          const user = data.user;
          setPseudo(user.userName);
          setPrenom(user.firstName);
          setNom(user.lastName);
          setEmail(user.email);
          setTelephone(user.phone);
          setBirthday(new Date(user.birthday));
          const visibleAnniv = new Date(user.birthday).toLocaleDateString(
            "fr-FR"
          );
          setBirthdayVisible(visibleAnniv);
          const loc = user.address.location.coordinates;
          fetch(
            `https://api-adresse.data.gouv.fr/reverse/?lon=${loc[0]}&lat=${loc[1]}`
          )
            .then((response) => response.json())
            .then((data) => {
              const tempAdd = data.features[0].properties;
              setAdress(`${tempAdd.name}, ${tempAdd.city}`);
              setDataAdress(data.features[0]);
            });
        } else {
          console.log(data.error);
        }
      });
  }, []);

  //Requête de l'API adresse
  const searchAdress = (query) => {
    // Prevent search with an empty query
    if (query.length < 3) {
      return;
    }

    fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}`)
      .then((response) => response.json())
      // features est un tableau d'objets avec toutes les adresses possibles
      .then(({ features }) => {
        const suggestions = features?.map((data) => {
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

  // au clic sur le bouton 'Enregistrer', requête de la route PUT /users/profiles
  const handleSubmit = () => {
    if (newPassword) {
      if (newPassword !== checkPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
      }
    }

    fetch(`${adresseServeur}/users/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        userName: pseudo,
        firstName: prenom,
        lastName: nom,
        phone: telephone,
        address: dataAdress,
        token: user.token,
        password: password,
        newPassword: newPassword,
        birthday: birthday,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.result) {
          console.log(data.error);
          return alert(data.error);
        } else {
          //si l'email a changé, on met à jour le reducer
          console.log(newPassword);
          if (user.email !== email) {
            dispatch(updateEmail({ email }));
          }
          alert("Votre profil a été mis à jour");
          navigation.navigate("TabNavigator", { screen: "Profil" });
        }
      });
  };

  // requête de la route DELETE/users/profile pour supprimer le compte utilisateur
  const handleDelete = () => {
    fetch(`${adresseServeur}/users/profile`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: user.token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          navigation.navigate("Login");
        } else {
          console.log(data.error);
          alert(data.error);
        }
      });
  };

  // Supprimer l'adresse et les réponses de l'API
  const handleClear = () => {
    setAdress("");
    setDataSet([]);
    setDataAdress({});
    setDataAdresses([]);
  };

  // interaction avec le DateTimePicker (ouverture, fermeture, changer la date)
  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setBirthday(date);
    setBirthdayVisible(date.toLocaleDateString("fr-FR"));
    hideDatePicker();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.titreContainer}>
            <Feather name="edit" size={28} color={colors.primary} />
            <Text style={styles.titre}>Modifier mon profil</Text>
          </View>
          <Text style={styles.description}>
            Mettez à jour vos informations personnelles
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Pseudo"
              onChangeText={setPseudo}
              value={pseudo}
            />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              onChangeText={setPrenom}
              value={prenom}
            />
            <TextInput
              style={styles.input}
              placeholder="Nom de famille"
              onChangeText={setNom}
              value={nom}
            />
            {/* Date de naissance */}
            <View style={styles.datepickerContainer}>
              <TextInput
                style={styles.inputDate}
                value={birthdayVisible}
                placeholder="Date de naissance"
                editable={false}
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
            {/* Fin date de naissance */}

            <TextInput
              style={styles.input}
              placeholder="email"
              onChangeText={setEmail}
              value={email}
              type="email"
            />
            <View style={styles.addressZone}>
              <AutocompleteDropdownContextProvider>
                <AutocompleteDropdown
                  onChangeText={(value) => {
                    setAdress(value);
                    searchAdress(value);
                  }}
                  onSelectItem={(item) => {
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
                  containerStyle={styles.dropdownContainer}
                  suggestionsListContainerStyle={styles.suggestionListContainer}
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
                  closeOnSubmit={true}
                  closeOnBlur={true}
                  showChevron={false}
                  showClear={true}
                  direction="up"
                ></AutocompleteDropdown>
              </AutocompleteDropdownContextProvider>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              onChangeText={setTelephone}
              value={telephone}
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe actuel"
              onChangeText={setPassword}
              value={password}
              type="password"
            />
            <TextInput
              style={styles.input}
              placeholder="Nouveau mot de passe"
              onChangeText={setNewPassword}
              value={newPassword}
              type="password"
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmer nouveau mot de passe"
              onChangeText={setCheckPassword}
              value={checkPassword}
              type="password"
            />
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity onPress={handleSubmit} style={styles.btnModifier}>
              <Text style={styles.btnTextModif}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              style={styles.btnSupprimer}
            >
              <Text style={styles.btnTextSupp}>Supprimer mon compte</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  titreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    gap: 10,
    marginBottom: 20,
  },
  titre: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: colors.primary,
  },
  description: {
    fontFamily: fonts.body,
    marginBottom: 20,
  },
  datepickerContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  inputDate: {
    backgroundColor: "white",
    width: "85%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
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
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: fonts.body,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 3,
  },

  // Style du conteneur de l'input
  inputContainer: {
    borderColor: colors.primary,
    width: "80%",
    marginBottom: 20,
    padding: 9,
  },
  btnContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-around",
    paddingBottom: 20,
    gap: 10,
  },
  btnModifier: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    borderRadius: 25,
    height: 55,
    width: 180,
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
  btnSupprimer: {
    alignSelf: "center",
    backgroundColor: colors.accent2,
    borderRadius: 25,
    height: 55,
    width: 150,
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
  btnTextModif: {
    fontFamily: fonts.body,
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
  btnTextSupp: {
    fontFamily: fonts.body,
    fontWeight: "bold",
    fontSize: 13,
    color: "white",
    textAlign: "center",
    width: 100,
    flexWrap: "wrap",
  },
});
