import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Pressable,
} from "react-native";

import Feather from "react-native-vector-icons/Feather";
import { fonts, colors } from "./theme";

//redux
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user, { logout } from "./reducers/user";
import favorites from "./reducers/favorites";
import dons from "./reducers/dons";
import photo from "./reducers/photo";

//Navigation
import {
  NavigationContainer,
  useNavigationContainerRef,
  CommonActions,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//Import des screens :
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreateProfileScreen from "./screens/CreateProfileScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import CreateDonationScreen from "./screens/CreateDonationScreen";
import SnapScreen from "./screens/SnapScreen";
import DonationScreen from "./screens/DonationScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import ConfResaScreen from "./screens/ConfResaScreen";
import ChatListScreen from "./screens/ChatListScreen";
import ConfRecepScreen from "./screens/ConfRecepScreen";

//Import des headers :
import HeaderArrow from "./components/HeaderArrow";
import HeaderBurger from "./components/HeaderBurger";
import HeaderArrowBurger from "./components/HeaderArrowBurger";
import HeaderGoBack from "./components/HeaderGoBack";

//Configuration du store Redux :
const store = configureStore({
  reducer: {
    user,
    favorites,
    dons,
    photo,
  },
});

const TabNavigator = ({ toggleMenu }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";
          if (route.name === "Home") iconName = "home";
          else if (route.name === "ChatList") iconName = "message-square";
          else if (route.name === "Profil") iconName = "user";
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF8C00",
        tabBarInactiveTintColor: "#2F4934",
        tabBarStyle: { backgroundColor: "#FFFAF0" },
      })}
    >
      {/*Écrans visibles dans la Tab Bar*/}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: () => (
            <HeaderBurger title="Accueil" onBurgerPress={toggleMenu} />
          ),
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          header: () => (
            <HeaderArrowBurger title="Messagerie" onBurgerPress={toggleMenu} />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          header: () => (
            <HeaderArrowBurger title="Profil" onBurgerPress={toggleMenu} />
          ),
        }}
      />

      {/*Écrans cachés mais avec Tab Bar Visible*/}
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          header: () => (
            <HeaderArrowBurger title="Messagerie" onBurgerPress={toggleMenu} />
          ),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="EditProfil"
        component={EditProfileScreen}
        options={{
          header: () => (
            <HeaderArrowBurger
              title="Éditeur de profil"
              onBurgerPress={toggleMenu}
            />
          ),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="CreateDonation"
        component={CreateDonationScreen}
        options={{
          header: () => (
            <HeaderArrowBurger title="Créer Don" onBurgerPress={toggleMenu} />
          ),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Donation"
        component={DonationScreen}
        options={{
          header: () => <HeaderArrow title="Produit" />,
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          header: () => (
            <HeaderArrowBurger title="Mes favoris" onBurgerPress={toggleMenu} />
          ),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ConfResa"
        component={ConfResaScreen}
        options={{
          header: () => (
            <HeaderArrowBurger title="Réservation" onBurgerPress={toggleMenu} />
          ),
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="ConfRecep"
        component={ConfRecepScreen}
        options={{
          header: () => (
            <HeaderBurger title="Confirmation" onBurgerPress={toggleMenu} />
          ),
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

// Composant principal
const AppContent = () => {
  const navigationRef = useNavigationContainerRef();
  const screenWidth = Dimensions.get("window").width;
  const menuWidth = screenWidth * 0.8;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(menuWidth)).current;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.value);

  const userName = user?.username || "Utilisateur";
  const email = user?.email || "Pas d'email";
  const prenom = user?.prenom || "Invité";

  const toggleMenu = () => {
    const targetValue = isMenuOpen ? menuWidth : 0;
    Animated.timing(slideAnim, {
      toValue: targetValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    Animated.timing(slideAnim, {
      toValue: menuWidth,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsMenuOpen(false);

    dispatch(logout());
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  const ActionItem = ({
    icon,
    title,
    subtitle,
    onPress,
    iconColor = colors.primary,
  }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.gray} />
    </TouchableOpacity>
  );

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Signup"
          component={SignUpScreen}
          options={{
            headerShown: true,
            header: () => <HeaderGoBack />,
          }}
        />
        <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        <Stack.Screen name="Snap" component={SnapScreen} />
        <Stack.Screen name="TabNavigator">
          {(props) => <TabNavigator {...props} toggleMenu={toggleMenu} />}
        </Stack.Screen>
      </Stack.Navigator>

      {isMenuOpen && <Pressable style={styles.overlay} onPress={toggleMenu} />}

      <Animated.View
        style={[
          styles.burgerMenu,
          { width: menuWidth, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <SafeAreaView style={styles.high_ctnr}>
          <TouchableOpacity onPress={toggleMenu}>
            <View style={styles.floatingIcon}>
              <Feather name="x-circle" size={28} color={colors.background} />
              <Text style={styles.welcome_msg}>Coucou {prenom} 😊</Text>
            </View>
            <View style={styles.userCard}>
              <View style={styles.avatarContainer}>
                <Feather name="user" size={50} color={colors.background} />
              </View>
              <View>
                <Text
                  style={{
                    color: colors.text2,
                    fontFamily: fonts.body,
                    fontSize: 18,
                    marginLeft: 10,
                  }}
                >
                  {userName}
                </Text>
                <Text
                  style={{
                    color: colors.text2,
                    fontFamily: fonts.body,
                    fontSize: 14,
                    marginLeft: 10,
                  }}
                >
                  {email}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </SafeAreaView>

        <View style={styles.middle_ctnr}>
          <ActionItem
            icon="user"
            title="Mon Profil"
            subtitle="Voir et modifier mon profil"
          />
          <ActionItem
            icon="help-circle"
            title="FAQ"
            subtitle="Consulter la FAQ"
          />
          <ActionItem
            icon="info"
            title="Mentions légales"
            subtitle="Voir les mentions légales"
          />
          <ActionItem
            icon="user"
            title="Nous contacter"
            subtitle="Contacter le support"
          />
        </View>

        <TouchableOpacity style={styles.btn_logout} onPress={handleLogout}>
          <Text style={{ color: "white", fontFamily: fonts.body }}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

// Composant racine
export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  burgerMenu: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.8,
    justifyContent: "space-between",
  },
  high_ctnr: {
    height: "25%",
    backgroundColor: colors.primary,
  },
  middle_ctnr: {
    flex: 1,
    padding: 10,
  },
  floatingIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 18,
  },
  welcome_msg: {
    color: colors.background,
    fontFamily: fonts.body,
    fontSize: 16,
    margin: "auto",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginLeft: 20,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.message,
    justifyContent: "center",
    alignItems: "center",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  actionContent: { flex: 1 },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    fontFamily: fonts.body,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: fonts.body,
    marginTop: 2,
  },
  btn_logout: {
    width: "50%",
    height: 50,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 70,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 5,
  },
});
