import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { useEffect, useState } from "react";
export default function StudentProfile() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    loadUser();
  }, []);
  const loadUser = async () => {
    const snap = await getDoc(doc(db, "users", String(id)));
    if (snap.exists()) {
      setUser(snap.data());
    }
  };
  const sendRequest = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid === id) return;
    await addDoc(collection(db, "requests"), {
      from: currentUser.uid,
      to: id,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    alert("Connection request sent");
  };
  if (!user) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.item}>School: {user.school}</Text>
      <Text style={styles.item}>Grade: {user.grade}</Text>
      <Text style={styles.item}>
        Subjects: {user.subjects?.join(", ")}
      </Text>
      <Button title="Connect" onPress={sendRequest} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: 20 },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  item: { marginBottom: 6 },
});