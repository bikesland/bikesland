import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const router = useRouter();

  // remaining code...
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>BIKESLAND</Text>

      <Text style={styles.title}>Admin Dashboard</Text>

      <Text style={styles.subtitle}>
        Manage your bikes
      </Text>

      <TouchableOpacity
  style={styles.button}
  onPress={() => router.push("/admin/add-bike")}
>
  <Text style={styles.buttonText}>
    🏍️ Add New Bike
  </Text>
</TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>📋 Manage Bikes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>💰 Update Prices</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>📸 Manage Photos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 22,
    paddingTop: 70,
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
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 15,
  },

  subtitle: {
    color: "#888",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 35,
  },

  button: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});