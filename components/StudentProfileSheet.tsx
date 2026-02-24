import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { useState } from "react";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

type StudentProfileSheetProps = {
  visible: boolean;
  user: any;
  onClose: () => void;
};

export default function StudentProfileSheet({
  visible,
  user,
  onClose,
}: StudentProfileSheetProps) {
  const { user: currentUser } = useAuth();
  const [requestSent, setRequestSent] = useState(false);

  if (!user) return null;

  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST";

  const screenHeight = Dimensions.get("window").height;

  // 🔥 SEND STUDY REQUEST
  const sendRequest = async () => {
    try {
      if (!currentUser) return;

      // Prevent duplicate requests
      const q = query(
        collection(db, "connections"),
        where("senderId", "==", currentUser.uid),
        where("receiverId", "==", user.id)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        Alert.alert("Already Sent", "You already sent a request.");
        return;
      }

      await addDoc(collection(db, "connections"), {
        senderId: currentUser.uid,
        receiverId: user.id,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setRequestSent(true);
    } catch (error) {
      console.log("Request error:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.card, { maxHeight: screenHeight * 0.55 }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.name}>{user.name || "Student"}</Text>
                <Text style={styles.meta}>
                  {user.form ?? "Form ?"} • {user.school ?? "-"}
                </Text>
              </View>
            </View>

            {/* Subjects */}
            <Text style={styles.sectionTitle}>Subjects</Text>
            <View style={styles.subjectsContainer}>
              {user.subjects?.length ? (
                user.subjects.map((s: string) => (
                  <View key={s} style={styles.subjectChip}>
                    <Text style={styles.subjectText}>{s}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: "#6B7280" }}>No subjects listed</Text>
              )}
            </View>
          </ScrollView>

          {/* STUDY TOGETHER BUTTON */}
          <TouchableOpacity
            style={[
              styles.connectBtn,
              requestSent && { backgroundColor: "#E5E7EB" },
            ]}
            onPress={sendRequest}
            disabled={requestSent}
          >
            <Text
              style={[
                styles.connectText,
                requestSent && { color: "#6B7280" },
              ]}
            >
              {requestSent ? "✓ Request Sent" : "🤝 Study Together"}
            </Text>
          </TouchableOpacity>

          {/* CLOSE BUTTON */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#4F46E5",
    fontWeight: "800",
    fontSize: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  meta: {
    fontSize: 14,
    color: "#6B7280",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111827",
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  subjectChip: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  subjectText: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "500",
  },
  connectBtn: {
    backgroundColor: "#ECFDF5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  connectText: {
    color: "#059669",
    fontWeight: "700",
    fontSize: 16,
  },
  closeBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  closeText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
