import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { colors, fonts } from "../theme";

const HeaderBurger = ({ title, onBurgerPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onBurgerPress}>
        <Feather name="menu" size={36} color="#2F4934" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: "#FFFaf0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    color: "#2F4934",
    fontSize: 24,
    fontFamily: fonts.title,
  },
  menu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "#eee",
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 15,
  },
});

export default HeaderBurger;
