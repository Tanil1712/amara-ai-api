import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
type Props = {
  onClose: () => void;
};
export default function HomeworkSheet({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Homework</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>
        {/* FORM */}
        <TextInput
          placeholder="Homework title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
        />
        {/* DUE DATE */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: dueDate ? "#111827" : "#9CA3AF" }}>
            {dueDate
              ? `Due: ${dueDate.toDateString()}`
              : "Select due date"}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display={Platform.OS === "android" ? "calendar" : "spinner"}
            onChange={(_, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDueDate(selectedDate);
            }}
          />
        )}
        <TextInput
          placeholder="Details / Instructions"
          value={details}
          onChangeText={setDetails}
          style={[styles.input, styles.textArea]}
          multiline
        />
        {/* BUTTON */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Save Homework</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  close: {
    fontSize: 18,
    color: "#6B7280",
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    fontSize: 14,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});