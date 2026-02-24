// components/TodayCard.tsx
import { View, Text, StyleSheet, Image } from "react-native";

type TodayCardProps = {
  homeworkCount: number;
  homeworkCompleted?: number; // for progress bar
  homeworkNextSubject?: string;
  socialActiveCount: number;
  socialAvatars?: string[]; // URLs for avatars
};

export default function TodayCard({
  homeworkCount,
  homeworkCompleted = 0,
  homeworkNextSubject,
  socialActiveCount,
  socialAvatars = [],
}: TodayCardProps) {
  const progressPercent = homeworkCount
    ? Math.min((homeworkCompleted / homeworkCount) * 100, 100)
    : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>📅 Today</Text>

      {/* Homework Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Homework</Text>
        <Text style={styles.sectionDesc}>
          {homeworkCount} pending{" "}
          {homeworkNextSubject ? `• Next: ${homeworkNextSubject}` : ""}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
      </View>

      {/* Social Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Students</Text>
        <Text style={styles.sectionDesc}>{socialActiveCount} online</Text>
        <View style={styles.avatarsRow}>
          {socialAvatars.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.avatarMini} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#111827",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: "#111827",
    marginBottom: 6,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#6366F1",
    borderRadius: 3,
  },
  avatarsRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: -8,
    borderWidth: 1,
    borderColor: "#fff",
  },
});