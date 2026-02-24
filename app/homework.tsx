
import {
View,
Text,
TextInput,
TouchableOpacity,
Modal,
Platform,
ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "../lib/firebase";
import {
collection,
addDoc,
onSnapshot,
query,
where,
updateDoc,
doc,
serverTimestamp,
} from "firebase/firestore";
import AmaraSheet from "../components/AmaraSheet";

interface Homework {
id: string;
userId: string;
subject: string;
title: string;
description?: string;
difficulty: "Easy" | "Medium" | "Hard";
dueDate?: any;
completed: boolean;
createdAt?: any;
}

export default function HomeworkScreen() {
const user = auth.currentUser;

const [homeworks, setHomeworks] = useState<Homework[]>([]);
const [showAdd, setShowAdd] = useState(false);

const [subject, setSubject] = useState("");
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");

const [dueDate, setDueDate] = useState<Date | null>(null);
const [difficulty, setDifficulty] = useState<
"Easy" | "Medium" | "Hard"
>("Easy");

const [showPicker, setShowPicker] = useState(false);
const [showAmara, setShowAmara] = useState(false);
const [amaraContext, setAmaraContext] = useState("");

useEffect(() => {
if (!user) return;

const q = query(
collection(db, "homework"),
where("userId", "==", user.uid)
);

const unsub = onSnapshot(q, (snap) => {
const data = snap.docs.map(
(d) => ({ id: d.id, ...d.data() } as Homework)
);

data.sort((a, b) => {
const aTime = a.dueDate?.toDate
? a.dueDate.toDate().getTime()
: 0;
const bTime = b.dueDate?.toDate
? b.dueDate.toDate().getTime()
: 0;
return aTime - bTime;
});

setHomeworks(data);
});

return () => unsub();
}, [user]);

const completedCount = homeworks.filter((h) => h.completed).length;

const progress =
homeworks.length > 0
? Math.round((completedCount / homeworks.length) * 100)
: 0;

const overdueHomework = homeworks.filter(
(h) =>
!h.completed &&
h.dueDate?.toDate &&
h.dueDate.toDate() < new Date()
);

const upcomingHomework = homeworks.filter(
(h) =>
!h.completed &&
(!h.dueDate?.toDate ||
h.dueDate.toDate() >= new Date())
);

const saveHomework = async () => {
if (!subject || !title || !dueDate) return;

await addDoc(collection(db, "homework"), {
userId: user?.uid,
subject,
title,
description,
difficulty,
dueDate,
completed: false,
createdAt: serverTimestamp(),
});

setSubject("");
setTitle("");
setDescription("");
setDifficulty("Easy");
setDueDate(null);
setShowAdd(false);
};

const markDone = async (id: string) => {
await updateDoc(doc(db, "homework", id), {
completed: true,
});
};

const difficultyColor = (level: string) => {
if (level === "Easy") return "#10B981";
if (level === "Medium") return "#F59E0B";
return "#EF4444";
};

const renderCard = (item: Homework, isOverdue: boolean) => (
<View
key={item.id}
style={{
backgroundColor: "#FFF",
borderRadius: 20,
padding: 18,
marginBottom: 16,
shadowColor: "#000",
shadowOpacity: 0.06,
shadowRadius: 6,
elevation: 3,
borderLeftWidth: 6,
borderLeftColor: isOverdue ? "#EF4444" : "#4F46E5",
}}
>
<Text style={{ fontWeight: "800", fontSize: 19 }}>
{item.title}
</Text>

<View
style={{
flexDirection: "row",
marginTop: 6,
marginBottom: 8,
flexWrap: "wrap",
}}
>
<View
style={{
backgroundColor: "#EEF2FF",
paddingHorizontal: 10,
paddingVertical: 4,
borderRadius: 20,
marginRight: 8,
}}
>
<Text style={{ color: "#4F46E5", fontWeight: "600" }}>
{item.subject}
</Text>
</View>

<View
style={{
backgroundColor: difficultyColor(item.difficulty),
paddingHorizontal: 10,
paddingVertical: 4,
borderRadius: 20,
}}
>
<Text style={{ color: "#FFF", fontWeight: "600" }}>
{item.difficulty}
</Text>
</View>
</View>

<Text style={{ color: "#6B7280", marginBottom: 10 }}>
📅{" "}
{item.dueDate?.toDate
? item.dueDate.toDate().toDateString()
: ""}
</Text>

{isOverdue && (
<Text
style={{
color: "#EF4444",
fontWeight: "700",
marginBottom: 10,
}}
>
⚠ This task is overdue
</Text>
)}

<View
style={{
flexDirection: "row",
justifyContent: "space-between",
}}
>
<TouchableOpacity
onPress={() => {
setAmaraContext(
`Subject: ${item.subject}\nTitle: ${item.title}\nDescription: ${item.description}`
);
setShowAmara(true);
}}
style={{
borderWidth: 1.5,
borderColor: "#4F46E5",
paddingVertical: 10,
paddingHorizontal: 16,
borderRadius: 14,
}}
>
<Text style={{ color: "#4F46E5", fontWeight: "700" }}>
🤖 Ask Amara
</Text>
</TouchableOpacity>

{!item.completed && (
<TouchableOpacity
onPress={() => markDone(item.id)}
style={{
backgroundColor: "#10B981",
paddingVertical: 10,
paddingHorizontal: 16,
borderRadius: 14,
}}
>
<Text style={{ color: "#FFF", fontWeight: "700" }}>
✓ Mark Done
</Text>
</TouchableOpacity>
)}
</View>
</View>
);

return (
<ScrollView
style={{ flex: 1, backgroundColor: "#F3F4F6" }}
contentContainerStyle={{ padding: 18 }}
showsVerticalScrollIndicator={false}
>
<Text
style={{
fontSize: 30,
fontWeight: "800",
marginBottom: 18,
}}
>
📚 Homework
</Text>

{/* Progress Card */}
<View
style={{
backgroundColor: "#FFF",
borderRadius: 22,
padding: 18,
marginBottom: 22,
elevation: 3,
}}
>
<Text
style={{
fontWeight: "700",
color: "#6B7280",
marginBottom: 8,
}}
>
TODAY'S PROGRESS
</Text>

<Text
style={{
fontSize: 28,
fontWeight: "800",
color: "#4F46E5",
marginBottom: 8,
}}
>
{progress}%
</Text>

<View
style={{
height: 10,
backgroundColor: "#E5E7EB",
borderRadius: 20,
overflow: "hidden",
marginBottom: 8,
}}
>
<View
style={{
width: `${progress}%`,
height: "100%",
backgroundColor: "#4F46E5",
}}
/>
</View>

<Text style={{ color: "#6B7280" }}>
{completedCount} of {homeworks.length} tasks done 💪
</Text>
</View>

{/* Add Button */}
<TouchableOpacity
onPress={() => setShowAdd(true)}
style={{
backgroundColor: "#4F46E5",
padding: 18,
borderRadius: 20,
marginBottom: 24,
}}
>
<Text
style={{
color: "#FFF",
fontWeight: "800",
textAlign: "center",
fontSize: 16,
}}
>
+ Add Homework
</Text>
</TouchableOpacity>

{overdueHomework.length > 0 && (
<>
<Text
style={{
fontSize: 20,
fontWeight: "800",
color: "#EF4444",
marginBottom: 10,
}}
>
🚨 Overdue
</Text>
{overdueHomework.map((item) =>
renderCard(item, true)
)}
</>
)}

{upcomingHomework.length > 0 && (
<>
<Text
style={{
fontSize: 20,
fontWeight: "800",
marginTop: 12,
marginBottom: 10,
}}
>
📅 Upcoming
</Text>
{upcomingHomework.map((item) =>
renderCard(item, false)
)}
</>
)}

{homeworks.length === 0 && (
<Text
style={{
textAlign: "center",
color: "#6B7280",
marginTop: 30,
}}
>
🎉 No homework yet. Add your first task!
</Text>
)}

<AmaraSheet
visible={showAmara}
onClose={() => setShowAmara(false)}
contextText={amaraContext}
/>
</ScrollView>
);
}