import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "users", res.user.uid));

      if (!snap.exists() || !snap.data()?.profileCompleted) {
        router.replace("/(auth)/profile-setup");
      } else {
        router.replace("/home");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inner}>

          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />

          <Text style={styles.title}>Welcome back</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text style={styles.link}>Create an account</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    padding: 20,
  },

  inner: {
    width: "100%",
    alignItems: "center",
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
    resizeMode: "contain",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#FFF",
    width: "100%",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#4F46E5",
    padding: 14,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  signupContainer: {
    marginTop: 18,
    alignItems: "center",
  },

  link: {
    color: "#4F46E5",
    fontWeight: "500",
  },

  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});