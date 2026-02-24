
import {
Modal,
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
ScrollView,
Pressable,
Alert,
KeyboardAvoidingView,
Platform,
Keyboard,
TouchableWithoutFeedback,
} from "react-native";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export default function CreatePostSheet({
visible,
onClose,
}: {
visible: boolean;
onClose: () => void;
}) {
const { user, profile } = useAuth();

const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
const [content, setContent] = useState("");

const SUBJECTS = [
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

const subjectColors: Record<string, string> = {
Mathematics: "#6366F1",
"English Language": "#EC4899",
Biology: "#10B981",
Chemistry: "#EF4444",
Physics: "#F59E0B",
"Computer Science": "#0EA5E9",
Accounting: "#8B5CF6",
"Business Studies": "#F97316",
General: "#6B7280",
};

const toggleSubject = (sub: string) => {
if (selectedSubjects.includes(sub)) {
setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
} else {
setSelectedSubjects([...selectedSubjects, sub]);
}
};

const submitPost = async () => {
if (!content.trim()) {
Alert.alert("Empty Post", "Please write something.");
return;
}

if (selectedSubjects.length === 0) {
Alert.alert("Select Subject", "Please select at least one subject.");
return;
}

if (!user) return;

await addDoc(collection(db, "posts"), {
userId: user.uid,
userName: profile?.name || "Student",
userForm: profile?.form || "-",
userSchool: profile?.school || "-",
subjects: selectedSubjects,
text: content.trim(),
helpfulCount: 0,
createdAt: serverTimestamp(),
});

setSelectedSubjects([]);
setContent("");
onClose();
};

return (
<Modal visible={visible} transparent animationType="slide">
<KeyboardAvoidingView
behavior={Platform.OS === "ios" ? "padding" : "height"}
style={{ flex: 1 }}
>
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
<View style={{ flex: 1, justifyContent: "flex-end" }}>

<Pressable style={styles.overlay} onPress={onClose} />

<View style={styles.sheet}>
<View style={styles.dragHandle} />

<Text style={styles.title}>Create Study Post</Text>

<ScrollView
keyboardShouldPersistTaps="handled"
showsVerticalScrollIndicator={false}
contentContainerStyle={{ paddingBottom: 20 }}
>
<TextInput
placeholder="Ask your academic question..."
value={content}
onChangeText={setContent}
multiline
style={styles.input}
/>

<Text style={styles.label}>Select Subjects</Text>

<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
{SUBJECTS.map((sub) => {
const isSelected = selectedSubjects.includes(sub);
const color = subjectColors[sub];

return (
<TouchableOpacity
key={sub}
onPress={() => toggleSubject(sub)}
style={[
styles.chip,
{
backgroundColor: isSelected
? color
: color + "15",
},
]}
>
<Text
style={[
styles.chipText,
{ color: isSelected ? "#FFF" : color },
]}
>
{sub}
</Text>
</TouchableOpacity>
);
})}
</View>

<View style={styles.actions}>
<TouchableOpacity onPress={onClose}>
<Text style={styles.cancel}>Cancel</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.postBtn}
onPress={submitPost}
>
<Text style={styles.postBtnText}>Post Now</Text>
</TouchableOpacity>
</View>
</ScrollView>
</View>
</View>
</TouchableWithoutFeedback>
</KeyboardAvoidingView>
</Modal>
);
}

const styles = StyleSheet.create({
overlay: {
flex: 1,
backgroundColor: "rgba(0,0,0,0.4)",
},

sheet: {
backgroundColor: "#FFF",
borderTopLeftRadius: 28,
borderTopRightRadius: 28,
padding: 20,
maxHeight: "85%", // improvement
},

dragHandle: {
width: 40,
height: 5,
backgroundColor: "#E5E7EB",
borderRadius: 10,
alignSelf: "center",
marginBottom: 12,
},

title: {
fontSize: 18,
fontWeight: "700",
marginBottom: 12,
},

input: {
borderWidth: 1,
borderColor: "#E5E7EB",
borderRadius: 14,
padding: 14,
minHeight: 100,
textAlignVertical: "top",
marginBottom: 16,
},

label: {
fontWeight: "700",
marginBottom: 8,
},

chip: {
paddingHorizontal: 12,
paddingVertical: 7,
borderRadius: 999,
marginRight: 8,
marginBottom: 8,
},

chipText: {
fontWeight: "600",
fontSize: 12,
},

actions: {
flexDirection: "row",
justifyContent: "space-between",
marginTop: 18,
},

cancel: {
color: "#6B7280",
fontWeight: "600",
},

postBtn: {
backgroundColor: "#4F46E5",
paddingHorizontal: 22,
paddingVertical: 10,
borderRadius: 12,
},

postBtnText: {
color: "#FFF",
fontWeight: "700",
},
});