import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import StudentProfileSheet from "../../components/StudentProfileSheet";

export default function RequestsTab() {
  const currentUser = auth.currentUser;
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    if (!currentUser) return;

    const unsub = onSnapshot(doc(db, "users", currentUser.uid), async (snap) => {
      const data = snap.data();
      console.log("🔥 Current user data:", data); // Debug: log current user

      const incoming = data?.incomingRequests || [];
      console.log("📥 Incoming requests IDs:", incoming);

      if (!incoming.length) {
        setRequests([]);
        return;
      }

      try {
        const usersData = await Promise.all(
          incoming.map(async (uid: string) => {
            const uDoc = await getDoc(doc(db, "users", uid));
            if (!uDoc.exists()) {
              console.warn(`⚠️ User document not found for ID: ${uid}`);
              return null;
            }
            return { id: uid, ...uDoc.data() };
          })
        );

        // Remove nulls in case some users don't exist
        const filteredUsers = usersData.filter((u) => u !== null);
        console.log("✅ Incoming users fetched:", filteredUsers);

        setRequests(filteredUsers);
      } catch (error) {
        console.error("❌ Error fetching incoming users:", error);
      }
    });

    return () => unsub();
  }, []);

  const acceptRequest = async (userId: string) => {
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        incomingRequests: arrayRemove(userId),
        connections: arrayUnion(userId),
      });

      await updateDoc(doc(db, "users", userId), {
        outgoingRequests: arrayRemove(currentUser.uid),
        connections: arrayUnion(currentUser.uid),
      });

      console.log(`✅ Study request accepted for userId: ${userId}`);
    } catch (error) {
      console.error("❌ Error accepting request:", error);
    }
  };

  const declineRequest = async (userId: string) => {
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        incomingRequests: arrayRemove(userId),
      });

      await updateDoc(doc(db, "users", userId), {
        outgoingRequests: arrayRemove(currentUser.uid),
      });

      console.log(`🚫 Study request declined for userId: ${userId}`);
    } catch (error) {
      console.error("❌ Error declining request:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB", padding: 16 }}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 40 }}>
            No study requests yet
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
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={() => acceptRequest(item.id)}
                style={{
                  backgroundColor: "#4F46E5",
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "600" }}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => declineRequest(item.id)}
                style={{
                  backgroundColor: "#E5E7EB",
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "#111827", fontWeight: "600" }}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedUser(item)}
                style={{
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "#111827" }}>View</Text>
              </TouchableOpacity>
            </View>
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
