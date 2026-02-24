import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
type Props = {
  visible: boolean;
  onClose: () => void;
};
const SUBJECTS = [
  "Mathematics",
  "English",
  "Biology",
  "Physics",
  "Chemistry",
  "Geography",
  "History",
  "Computer Science",
  "Business Studies",
  "Economics",
  "Accounts",
];
export default function AddHomeworkSheet({ visible, onClose }: Props) {
  const user = auth.currentUser;
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const saveHomework = async () => {
    if (!user || !subject || !title || !dueDate) return;
    await addDoc(collection(db, "homework"), {
      userId: user.uid,
      subject,
      title,
      description,
      dueDate,
      completed: false,
      createdAt: serverTimestamp(),
    });
    // reset
    setSubject("");
    setTitle("");
    setDescription("");
    setDueDate(null);
    onClose();
  };
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: "#FFF",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 20,
          }}
        >
          {/* Handle */}
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#E5E7EB",
              borderRadius: 999,
              alignSelf: "center",
              marginBottom: 16,
            }}
          />
          <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 12 }}>
            Add Homework
          </Text>
          {/* Subjects */}
          <Text style={{ marginBottom: 6, fontWeight: "600" }}>
            Subject
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
            {SUBJECTS.map((sub) => {
              const selected = subject === sub;
              return (
                <TouchableOpacity
                  key={sub}
                  onPress={() => setSubject(sub)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: selected ? "#4F46E5" : "#EEF2FF",
                    marginRight: 6,
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ color: selected ? "#FFF" : "#4F46E5", fontSize: 12 }}>
                    {sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Title */}
          <TextInput
            placeholder="Homework title"
            value={title}
            onChangeText={setTitle}
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
            }}
          />
          {/* Description */}
          <TextInput
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
            }}
          />
          {/* Due Date */}
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              borderWidth: 1,
              borderColor: "#4F46E5",
              padding: 12,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#4F46E5" }}>
              {dueDate ? dueDate.toDateString() : "Select due date"}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display={Platform.OS === "android" ? "calendar" : "spinner"}
              onChange={(_, date) => {
                setShowPicker(false);
                if (date) setDueDate(date);
              }}
            />
          )}
          {/* Save */}
     <TouchableOpacity
            onPress={saveHomework}
            style={{
              backgroundColor: "#4F46E5",
              padding: 14,
              borderRadius: 14,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "700", textAlign: "center" }}>
              Save Homework
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ textAlign: "center", color: "#EF4444" }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}