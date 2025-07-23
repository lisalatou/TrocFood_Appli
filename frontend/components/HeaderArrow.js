import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { colors, fonts } from "../theme";

const HeaderArrow = ({ title }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Feather name="arrow-left" size={36} color="#2F4934" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 90,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: "#FFFaf0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: "5%",
    paddingLeft: "5%",
    //Android shadow :
    elevation: 4,
    // IOS shadow :
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontFamily: fonts.title,
    paddingLeft: "15%",
  },
});

export default HeaderArrow;
