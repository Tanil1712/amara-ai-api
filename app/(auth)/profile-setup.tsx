import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "expo-router";

// Type for user profile
type UserProfile = {
  name: string;
  school: string;
  form: string;
  subjects: string[];
  createdAt?: any;
  connections: string[];
  incomingRequests: string[];
  outgoingRequests: string[];
};

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [school, setSchool] = useState<string>("");
  const [form, setForm] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);

  const forms = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];

  const availableSubjects = [
"Mathematics",
"English Language",
"Biology",
"Chemistry",
"Physics",
"Computer Science",
"Accounting",
"Business Studies",
"General", 
  ];

  const toggleSubject = (sub: string) => {
    setSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const saveProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    if (!name || !school || !form || subjects.length === 0) {
      Alert.alert(
        "Missing information",
        "Please fill all fields and select at least one subject."
      );
      return;
    }

    try {
      const userRef = doc(db, "users", currentUser.uid);

      const userProfile: UserProfile = {
        name,
        school,
        form,
        subjects,
        createdAt: serverTimestamp(),
        connections: [],
        incomingRequests: [],
        outgoingRequests: [],
      };

      await setDoc(userRef, userProfile, { merge: true });
      router.replace("/home");
    } catch (err) {
      console.log("Profile save error:", err);
      Alert.alert("Error saving profile. Try again.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 16, backgroundColor: "#F9FAFB" }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: "#4F46E5",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        EduBox
      </Text>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 24 }}>
        Set up your profile
      </Text>

      <Text>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        style={inputStyle}
      />

      <Text>School</Text>
      <TextInput
        value={school}
        onChangeText={setSchool}
        placeholder="Your school"
        style={inputStyle}
      />

      <Text style={{ marginBottom: 8 }}>Select your form</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20 }}>
        {forms.map((f) => {
          const selected = form === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setForm(f)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: selected ? "#4F46E5" : "#EEF2FF",
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: selected ? "#FFF" : "#4F46E5",
                  fontWeight: "600",
                }}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={{ marginBottom: 8 }}>Select your subjects</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 24 }}>
        {availableSubjects.map((sub) => {
          const selected = subjects.includes(sub);
          return (
            <TouchableOpacity
              key={sub}
              onPress={() => toggleSubject(sub)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: selected ? "#4F46E5" : "#EEF2FF",
                marginRight: 6,
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  color: selected ? "#FFF" : "#4F46E5",
                  fontSize: 12,
                }}
              >
                {sub}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={saveProfile}
        style={{
          backgroundColor: "#4F46E5",
          paddingVertical: 16,
          borderRadius: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "600" }}>
          Save Profile
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  padding: 12,
  marginBottom: 16,
};
