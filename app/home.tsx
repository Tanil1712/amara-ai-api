

import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../lib/firebase";
import AmaraSheet from "../components/AmaraSheet";
import TodayCard from "../components/TodayCard";

type Student = {
  name: string;
  school: string;
  form: string;
  subjects: string[];
};

export default function HomeScreen() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [showAmara, setShowAmara] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);

  // ⭐ Dashboard Stats
  const [homeworkStats, setHomeworkStats] = useState({
    total: 0,
    completed: 0,
    overdue: 0,
    nextSubject: "",
  });

  const [connectionsCount, setConnectionsCount] = useState(0);

  //////////////////////////////////////////////////////
  // LOAD PROFILE
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setStudent(snap.data() as Student);
    };

    loadProfile();
  }, []);

  //////////////////////////////////////////////////////
  // REALTIME HOMEWORK STATS
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "homework"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const now = new Date();

      let total = 0;
      let completed = 0;
      let overdue = 0;
      let nextSubject = "";

      const sorted = snap.docs
        .map((d) => d.data())
        .sort((a: any, b: any) =>
          a.dueDate?.toDate() - b.dueDate?.toDate()
        );

      sorted.forEach((h: any) => {
        total++;

        if (h.completed) completed++;

        if (!h.completed && h.dueDate?.toDate() < now) overdue++;

        if (!nextSubject && !h.completed) {
          nextSubject = h.subject;
        }
      });

      setHomeworkStats({
        total,
        completed,
        overdue,
        nextSubject,
      });
    });

    return () => unsub();
  }, []);

  //////////////////////////////////////////////////////
  // REALTIME CONNECTIONS COUNT
  //////////////////////////////////////////////////////
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "connections"),
      where("status", "==", "accepted")
    );

    const unsub = onSnapshot(q, (snap) => {
      const count = snap.docs.filter((d) => {
        const data = d.data();
        return (
          data.senderId === user.uid ||
          data.receiverId === user.uid
        );
      }).length;

      setConnectionsCount(count);
    });

    return () => unsub();
  }, []);

  //////////////////////////////////////////////////////
  // UI HELPERS
  //////////////////////////////////////////////////////
  const initials = student?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("");

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <ScrollView style={styles.container}>
      {/* PROFILE */}
      {student && (
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              👋 {getGreeting()}, {student.name.split(" ")[0]}
            </Text>

            <Text style={styles.schoolText}>
              {student.form} • {student.school}
            </Text>

            <Text style={styles.streakText}>
              🤝 {connectionsCount} Study Partners
            </Text>
          </View>
        </View>
      )}

      {/* DASHBOARD STATS */}
      <View style={styles.statsRow}>
        <StatCard title="Homework" value={homeworkStats.total} color="#6366F1" />
        <StatCard title="Completed" value={homeworkStats.completed} color="#10B981" />
        <StatCard title="Overdue" value={homeworkStats.overdue} color="#EF4444" />
      </View>

      {/* TODAY CARD (NOW REAL) */}
      <TodayCard
        homeworkCount={homeworkStats.total}
        homeworkCompleted={homeworkStats.completed}
        homeworkNextSubject={homeworkStats.nextSubject}
        socialActiveCount={connectionsCount}
        socialAvatars={[]}
      />

      {/* FEATURE GRID */}
      <View style={styles.grid}>
        <MenuCard title="StudentLink" icon="🤝" onPress={() => router.push("/studentlink")} />
        <MenuCard title="Homework" icon="📚" onPress={() => router.push("/homework")} />
        <MenuCard title="Discover" icon="🌍" onPress={() => router.push("/discover")} />
        <MenuCard title="Ask Amara" icon="🧠" onPress={() => setShowAmara(true)} />
      </View>

      <AmaraSheet visible={showAmara} onClose={() => setShowAmara(false)} />
    </ScrollView>
  );
}

//////////////////////////////////////////////////////
// SMALL COMPONENTS
//////////////////////////////////////////////////////

const StatCard = ({ title, value, color }: any) => (
  <View style={[styles.statCard, { borderColor: color }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const MenuCard = ({ title, icon, onPress }: any) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

//////////////////////////////////////////////////////
// STYLES
//////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },

  profileCard: {
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  avatarText: { color: "#fff", fontSize: 22, fontWeight: "800" },
  greeting: { fontSize: 18, fontWeight: "700" },
  schoolText: { color: "#4B5563" },
  streakText: { color: "#6366F1", marginTop: 4, fontWeight: "600" },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    width: "30%",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
  },

  statValue: { fontSize: 22, fontWeight: "800" },
  statTitle: { fontSize: 12, color: "#6B7280" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    alignItems: "center",
  },

  icon: { fontSize: 36, marginBottom: 8 },
  cardTitle: { fontWeight: "700" },
});
