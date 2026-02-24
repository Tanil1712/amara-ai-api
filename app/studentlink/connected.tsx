import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import StudentProfileSheet from "../../components/StudentProfileSheet";

export default function ConnectedTab() {
  const currentUser = auth.currentUser;
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    if (!currentUser) return;

    // Real-time listener on current user's document
    const unsub = onSnapshot(doc(db, "users", currentUser.uid), async (snap) => {
      const data = snap.data();

      if (!data?.connections?.length) {
        setConnections([]);
        setLoading(false);
        return;
      }

      try {
        const connectedUsersData = await Promise.all(
          data.connections.map(async (uid: string) => {
            const uDoc = await getDoc(doc(db, "users", uid));
            return { id: uid, ...uDoc.data() };
          })
        );

        setConnections(connectedUsersData);
      } catch (error) {
        console.log("Fetch connected users error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F9FAFB" }}>
      <FlatList
        data={connections}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 40 }}>
            You have no connections yet
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.name}</Text>
            <Text style={{ color: "#6B7280", marginBottom: 12 }}>
              Grade {item.grade} • {item.school}
            </Text>
            <Text style={{ color: "#4F46E5", marginBottom: 10 }}>
              {item.subjects?.slice(0, 3).join(", ")}
              {item.subjects?.length > 3 ? " +" : ""}
            </Text>

            <TouchableOpacity
              onPress={() => setSelectedUser(item)}
              style={{
                borderWidth: 1,
                borderColor: "#E5E7EB",
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 12,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ color: "#111827", fontWeight: "500" }}>View Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <StudentProfileSheet
        visible={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </View>
  );
}
