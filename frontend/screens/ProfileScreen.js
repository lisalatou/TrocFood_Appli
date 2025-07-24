import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import { colors, fonts } from "../theme";
import { useSelector } from "react-redux";

//Screen du profil de l'utilisateur

export default function ProfileScreen({ navigation }) {
  const user = useSelector((state) => state.user?.value);
  const favorites = useSelector((state) => state.favorites?.value || []);
  const dons = useSelector((state) => state.dons?.value || []);

  const userName = user?.username || "Utilisateur";
  const userEmail = user?.email || "email@exemple.com";
  const favoritesCount = favorites.length;
  const donsCreatedCount = dons.filter(
    (don) => don.user?.email === userEmail || don.user?._id === user?._id
  ).length;
  const daysSinceCreation = Math.floor(
    (new Date() - (user?.createdAt ? new Date(user.createdAt) : new Date())) /
      (1000 * 60 * 60 * 24)
  );

  // Composant statistiques
  const StatCard = ({ icon, number, label, iconColor = colors.primary }) => (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  // Composant réutilisable pour les éléments d'action
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
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section en-tête profil*/}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Feather name="user" size={42} color={colors.primary} />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>
          </View>
        </View>

        {/* Section statistique */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes statistiques</Text>
          <View style={styles.statsGrid}>
            {/* Dons créés par l'utilisateur */}
            <StatCard
              icon="package"
              number={donsCreatedCount}
              label="Dons créés"
            />
            {/* Estimation de nourriture sauvée */}
            <StatCard
              icon="shopping-bag"
              number="0.5 kg"
              label="Nourriture sauvée"
              iconColor="#4ECDC4"
            />
            {/* Nombre de personnes aidées */}
            <StatCard
              icon="users"
              number={donsCreatedCount}
              label="Personnes aidées"
              iconColor="#FF6B6B"
            />
            {/* Jours depuis la création du compte */}
            <StatCard
              icon="calendar"
              number={daysSinceCreation}
              label="Jours actif"
              iconColor="#95A5A6"
            />
          </View>
        </View>

        {/* Section action */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionsList}>
            {/* Modifier le profil */}
            <ActionItem
              icon="edit-3"
              title="Modifier mon profil"
              subtitle="Informations personnelles"
              onPress={() => navigation.navigate("EditProfil")}
            />
            {/* Gérer les annonces créées */}
            <ActionItem
              icon="list"
              title="Gérer mes annonces"
              subtitle={
                donsCreatedCount > 0
                  ? `${donsCreatedCount} annonce(s)`
                  : "Modifier ou supprimer"
              }
              // onPress={() => navigation.navigate("MesAnnonces")}
            />
            {/* Annonces favorites */}
            <ActionItem
              icon="heart"
              title="Mes favoris"
              subtitle={
                favoritesCount > 0
                  ? `${favoritesCount} favori(s)`
                  : "Annonces sauvegardées"
              }
              onPress={() => navigation.navigate("Favorites")}
              iconColor="#FF6B6B"
            />
            {/* Paramètres de l'application */}
            <ActionItem
              icon="settings"
              title="Paramètres"
              subtitle="Notifications, confidentialité"
              // onPress={() => navigation.navigate("Parametres")}
            />
          </View>
        </View>

        {/* Section aide */}
        <View style={styles.helpSection}>
          <TouchableOpacity style={styles.helpItem}>
            <Feather name="help-circle" size={20} color={colors.primary} />
            <Text style={styles.helpText}>Centre d'aide</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helpItem}>
            <Feather name="message-circle" size={20} color={colors.primary} />
            <Text style={styles.helpText}>Nous contacter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: "Merriweather-Bold",
    marginBottom: 16,
  },
  profileHeader: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.primary + "20",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: fonts.title,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.body,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    padding: 16,
    alignItems: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: fonts.title,
  },
  statLabel: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.body,
    textAlign: "center",
    marginTop: 4,
  },
  actionsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
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
  actionContent: {
    flex: 1,
  },
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
  helpSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    marginBottom: 24,
  },
  helpItem: {
    alignItems: "center",
  },
  helpText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.body,
    marginTop: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});
