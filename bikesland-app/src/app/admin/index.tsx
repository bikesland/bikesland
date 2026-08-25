import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (username === "admin" && password === "123456") {
      router.replace("/admin/dashboard");
    } else {
      Alert.alert("Login Failed", "Username or password is incorrect.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>BIKESLAND</Text>

      <Text style={styles.title}>Admin Panel</Text>

      <Text style={styles.subtitle}>
        Manage your bikes easily
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#777"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#777"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={login}
      >
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  logo: {
    color: "#e50914",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 3,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
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
    borderRadius: 9,
    color: "#fff",
    paddingHorizontal: 15,
    marginBottom: 14,
  },

  loginButton: {
    height: 52,
    backgroundColor: "#e50914",
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  loginText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },
});