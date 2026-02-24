

import {
View,
Text,
FlatList,
TouchableOpacity,
ActivityIndicator,
StyleSheet,
Modal,
TextInput,
Pressable,
Alert,
} from "react-native";
import { useEffect, useState } from "react";
import {
collection,
onSnapshot,
query,
orderBy,
doc,
updateDoc,
increment,
addDoc,
serverTimestamp,
getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import StudentProfileSheet from "../components/StudentProfileSheet";

type Post = {
id: string;
text: string;
subjects: string[];
helpfulCount: number;
createdAt?: any;
userId: string;
userName: string;
userForm: string;
userSchool: string;
};

export default function DiscoverFeed() {
const { user, profile } = useAuth();

const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(true);
const [selectedUser, setSelectedUser] = useState<any>(null);

const [showSheet, setShowSheet] = useState(false);
const [postText, setPostText] = useState("");
const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

/* ================= GLOBAL MVP SUBJECTS ================= */

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

const subjectColors: any = {
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

/* ================= FORMAT TIME ================= */

const formatTime = (timestamp: any) => {
if (!timestamp) return "";
const date = timestamp.toDate();
return (
date.toLocaleDateString() +
" • " +
date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
);
};

/* ================= LOAD POSTS ================= */

useEffect(() => {
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

const unsub = onSnapshot(q, (snapshot) => {
const data = snapshot.docs.map((d) => ({
id: d.id,
helpfulCount: d.data().helpfulCount || 0,
...d.data(),
})) as Post[];

setPosts(data);
setLoading(false);
});

return () => unsub();
}, []);

/* ================= HELPFUL ================= */

const markHelpful = async (postId: string) => {
const ref = doc(db, "posts", postId);
await updateDoc(ref, { helpfulCount: increment(1) });
};

/* ================= CREATE POST ================= */

const createPost = async () => {
if (!postText.trim() || !user) return;

if (selectedSubjects.length === 0) {
Alert.alert("Select Subject", "Please select at least one subject.");
return;
}

await addDoc(collection(db, "posts"), {
text: postText,
subjects: selectedSubjects,
helpfulCount: 0,
createdAt: serverTimestamp(),
userId: user.uid,
userName: profile?.name || "Student",
userForm: profile?.form || "-",
userSchool: profile?.school || "-",
});

setPostText("");
setSelectedSubjects([]);
setShowSheet(false);
};

/* ================= STUDY TOGETHER ================= */

const openStudent = async (userId: string) => {
const snap = await getDoc(doc(db, "users", userId));
if (snap.exists()) {
setSelectedUser({
id: userId,
...snap.data(),
});
}
};

/* ================= LOADING ================= */

if (loading) {
return (
<View style={styles.center}>
<ActivityIndicator size="large" color="#4F46E5" />
</View>
);
}

return (
<View style={styles.screen}>
{/* HEADER */}
<View style={styles.header}>
<Text style={styles.logo}>EduBox</Text>
<Text style={styles.subtitle}>Discover Feed</Text>
</View>

{/* FEED */}
<FlatList
data={posts}
keyExtractor={(item) => item.id}
contentContainerStyle={styles.feed}
showsVerticalScrollIndicator={false}
renderItem={({ item }) => (
<View style={styles.card}>
<View style={styles.row}>
<View style={styles.avatar}>
<Text style={styles.avatarText}>
{item.userName?.charAt(0)}
</Text>
</View>

<View>
<Text style={styles.name}>{item.userName}</Text>
<Text style={styles.meta}>
{item.userForm} • {item.userSchool} •{" "}
{formatTime(item.createdAt)}
</Text>
</View>
</View>

<Text style={styles.postText}>{item.text}</Text>

<View style={styles.subjects}>
{item.subjects?.map((s) => {
const color = subjectColors[s] || "#4F46E5";
return (
<View
key={s}
style={[
styles.subjectChip,
{ backgroundColor: color + "15" },
]}
>
<Text
style={[
styles.subjectText,
{ color: color },
]}
>
{s}
</Text>
</View>
);
})}
</View>

<View style={styles.actions}>
<TouchableOpacity onPress={() => markHelpful(item.id)}>
<Text style={styles.helpfulText}>
👍 Helpful ({item.helpfulCount})
</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={() => openStudent(item.userId)}
style={styles.connectBtn}
>
<Text style={styles.connectText}>Study Together</Text>
</TouchableOpacity>
</View>
</View>
)}
/>

{/* FLOATING BUTTON */}
<TouchableOpacity
style={styles.floatingBtn}
onPress={() => {
setSelectedSubjects([]);
setShowSheet(true);
}}
>
<Text style={styles.floatingBtnText}>＋</Text>
</TouchableOpacity>

{/* BOTTOM SHEET */}
<Modal visible={showSheet} animationType="slide" transparent>
<Pressable
style={styles.overlay}
onPress={() => setShowSheet(false)}
/>

<View style={styles.sheet}>
<View style={styles.dragHandle} />

<Text style={styles.sheetTitle}>Create Study Post</Text>

<TextInput
placeholder="Ask your question..."
value={postText}
onChangeText={setPostText}
multiline
style={styles.input}
/>

<Text style={styles.sectionTitle}>Select Subjects</Text>

<View style={styles.subjects}>
{SUBJECTS.map((s) => {
const isSelected = selectedSubjects.includes(s);
const color = subjectColors[s];

return (
<TouchableOpacity
key={s}
onPress={() => {
if (isSelected) {
setSelectedSubjects(
selectedSubjects.filter((sub) => sub !== s)
);
} else {
setSelectedSubjects([...selectedSubjects, s]);
}
}}
style={[
styles.subjectChip,
{
backgroundColor: isSelected
? color
: color + "15",
},
]}
>
<Text
style={[
styles.subjectText,
{
color: isSelected ? "#FFF" : color,
},
]}
>
{s}
</Text>
</TouchableOpacity>
);
})}
</View>

<View style={styles.sheetActions}>
<TouchableOpacity onPress={() => setShowSheet(false)}>
<Text style={styles.cancelText}>Cancel</Text>
</TouchableOpacity>

<TouchableOpacity
onPress={createPost}
style={styles.postBtn}
>
<Text style={styles.postBtnText}>Post Now</Text>
</TouchableOpacity>
</View>
</View>
</Modal>

<StudentProfileSheet
visible={!!selectedUser}
user={selectedUser}
onClose={() => setSelectedUser(null)}
/>
</View>
);
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
screen: { flex: 1, backgroundColor: "#F9FAFB" },
center: { flex: 1, justifyContent: "center", alignItems: "center" },

header: {
backgroundColor: "#FFF",
paddingTop: 60,
paddingBottom: 18,
alignItems: "center",
borderBottomWidth: 1,
borderColor: "#F1F5F9",
},

logo: { fontSize: 26, fontWeight: "800", color: "#4F46E5" },
subtitle: { color: "#6B7280", fontSize: 13, marginTop: 4 },

feed: { padding: 16 },

card: {
backgroundColor: "#FFF",
borderRadius: 20,
padding: 18,
marginBottom: 16,
elevation: 3,
},

row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },

avatar: {
width: 42,
height: 42,
borderRadius: 21,
backgroundColor: "#EEF2FF",
justifyContent: "center",
alignItems: "center",
marginRight: 10,
},

avatarText: {
color: "#4F46E5",
fontWeight: "700",
fontSize: 16,
},

name: { fontWeight: "700", fontSize: 15 },
meta: { color: "#6B7280", fontSize: 12 },

postText: { fontSize: 15, marginVertical: 8 },

subjects: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },

subjectChip: {
paddingHorizontal: 10,
paddingVertical: 6,
borderRadius: 999,
marginRight: 6,
marginBottom: 6,
},

subjectText: { fontWeight: "600", fontSize: 12 },

actions: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
marginTop: 14,
paddingTop: 10,
borderTopWidth: 1,
borderColor: "#F3F4F6",
},

helpfulText: {
color: "#4F46E5",
fontWeight: "600",
fontSize: 14,
},

connectBtn: {
backgroundColor: "#ECFDF5",
paddingHorizontal: 14,
paddingVertical: 8,
borderRadius: 10,
},

connectText: { color: "#059669", fontWeight: "700" },

floatingBtn: {
position: "absolute",
bottom: 30,
right: 24,
backgroundColor: "#4F46E5",
width: 62,
height: 62,
borderRadius: 31,
justifyContent: "center",
alignItems: "center",
elevation: 6,
},

floatingBtnText: { color: "#FFF", fontSize: 26 },

overlay: {
flex: 1,
backgroundColor: "rgba(0,0,0,0.4)",
},

sheet: {
backgroundColor: "#FFF",
padding: 20,
borderTopLeftRadius: 28,
borderTopRightRadius: 28,
},

dragHandle: {
width: 40,
height: 5,
backgroundColor: "#E5E7EB",
borderRadius: 10,
alignSelf: "center",
marginBottom: 12,
},

sheetTitle: {
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
marginBottom: 14,
},

sectionTitle: { fontWeight: "700", marginBottom: 6 },

sheetActions: {
flexDirection: "row",
justifyContent: "space-between",
marginTop: 14,
},

cancelText: { color: "#6B7280", fontWeight: "600" },

postBtn: {
backgroundColor: "#4F46E5",
paddingHorizontal: 20,
paddingVertical: 10,
borderRadius: 12,
},

postBtnText: { color: "#FFF", fontWeight: "700" },
});