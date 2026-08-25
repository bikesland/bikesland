import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function AddBike() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("");
  const [km, setKm] = useState("");
  const [description, setDescription] = useState("");

  const addBike = () => {
    if (!name || !price || !location || !year || !km) {
      Alert.alert(
        "Missing Details",
        "Please fill all required fields."
      );
      return;
    }

    Alert.alert(
      "Success",
      `${name} added successfully!`
    );

    setName("");
    setPrice("");
    setLocation("");
    setYear("");
    setKm("");
    setDescription("");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.logo}>BIKESLAND</Text>

      <Text style={styles.title}>Add New Bike</Text>

      <Text style={styles.subtitle}>
        Enter bike details
      </Text>

      {/* BIKE NAME */}
      <TextInput
        style={styles.input}
        placeholder="Bike Name"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
      />

      {/* PRICE */}
      <TextInput
        style={styles.input}
        placeholder="Price"
        placeholderTextColor="#777"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* LOCATION */}
      <TextInput
        style={styles.input}
        placeholder="Location"
        placeholderTextColor="#777"
        value={location}
        onChangeText={setLocation}
      />

      {/* YEAR */}
      <TextInput
        style={styles.input}
        placeholder="Year"
        placeholderTextColor="#777"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />

      {/* KM */}
      <TextInput
        style={styles.input}
        placeholder="KM Driven"
        placeholderTextColor="#777"
        value={km}
        onChangeText={setKm}
        keyboardType="numeric"
      />

      {/* DESCRIPTION */}
      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Description"
        placeholderTextColor="#777"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* ADD BIKE BUTTON */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={addBike}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          ADD BIKE
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 50,
  },

  logo: {
    color: "#e50914",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 3,
    textAlign: "center",
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 15,
  },

  subtitle: {
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 30,
  },

  input: {
    height: 52,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 10,
    color: "#fff",
    paddingHorizontal: 15,
    marginBottom: 14,
    fontSize: 14,
  },

  description: {
    height: 110,
    paddingTop: 15,
    textAlignVertical: "top",
  },

  addButton: {
    height: 55,
    backgroundColor: "#e50914",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },
});