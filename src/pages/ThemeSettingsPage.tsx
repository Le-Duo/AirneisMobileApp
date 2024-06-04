import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useStore from "../Store";
import { useGetStyles } from "../styles";
import { RadioButton } from "react-native-paper";

const ThemeSettingsPage = () => {
  const { styles } = useGetStyles();
  const navigation = useNavigation();
  const { mode, switchMode } = useStore();

  const handleSwitchMode = (selectedMode: "light" | "dark") => {
    console.log("Attempting to switch mode to:", selectedMode);
    switchMode(selectedMode);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez un thème</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioItem}
          onPress={() => handleSwitchMode("light")}
        >
          <RadioButton
            value="light"
            status={mode === "light" ? "checked" : "unchecked"}
            onPress={() => handleSwitchMode("light")}
          />
          <Text style={styles.text}>Clair</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioItem}
          onPress={() => handleSwitchMode("dark")}
        >
          <RadioButton
            value="dark"
            status={mode === "dark" ? "checked" : "unchecked"}
            onPress={() => handleSwitchMode("dark")}
          />
          <Text style={styles.text}>Sombre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ThemeSettingsPage;
