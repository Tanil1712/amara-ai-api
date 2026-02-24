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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { router } from "expo-router";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Create user in Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create Firestore user document
      await setDoc(doc(db, "users", res.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
        profileCompleted: false,
      });

      // Navigate to profile setup
      router.replace("/(auth)/profile-setup");
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

            <Text style={styles.title}>Create account</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="words"
              textContentType="name"
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
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
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating..." : "Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
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

  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
