import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { colors, fonts } from "../theme";

export default function DonCard({
  don,
  distance,
  isFavorite,
  onToggleFavorite,
  onPress,
}) {
  // Formatage de la date
  const formattedDate = new Date(don.createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });

  // formatage de distance
  const formatDistance = (distanceInKm) => {
    if (distanceInKm === null || distanceInKm === undefined) {
      return;
    }
    if (distanceInKm < 1) {
      return `${Math.round(distanceInKm * 1000)}m`;
    }
    return distanceInKm < 10
      ? `${Math.round(distanceInKm * 10) / 10}km`
      : `${Math.round(distanceInKm)}km`;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Photo */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              don.image && don.image.trim() !== ""
                ? don.image
                : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop&auto=format",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Bouton favori */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={onToggleFavorite}
          activeOpacity={0.7}
        >
          <Feather
            name="heart"
            size={16}
            color={isFavorite ? "#FF6B6B" : "#FFFFFF"}
            style={!isFavorite && styles.heartOutline}
          />
        </TouchableOpacity>
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        <View style={styles.distanceRow}>
          <Feather name="map-pin" size={12} color={colors.primary} />
          <Text style={styles.distance}>{formatDistance(distance)}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {don.title}
          </Text>
        </View>
        <View style={styles.dateRow}>
          <Feather name="clock" size={12} color="#999" />
          <Text style={styles.date}>En ligne le {formattedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 280,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    flexDirection: "column",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    height: 160,
    width: "100%",
    position: "relative",
  },
  image: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    resizeMode: "cover",
  },
  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  heartOutline: {
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "flex-start",
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  distance: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: fonts.body,
    fontWeight: "600",
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
    fontFamily: fonts.body,
    lineHeight: 20,
    textAlign: "left",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  date: {
    fontSize: 12,
    color: "#999",
    fontFamily: fonts.body,
    fontWeight: "500",
  },
});
