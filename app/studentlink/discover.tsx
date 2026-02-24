
import {
View,
Text,
FlatList,
TouchableOpacity,
ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import {
collection,
getDocs,
doc,
getDoc,
updateDoc,
arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import StudentProfileSheet from "../../components/StudentProfileSheet";

export default function DiscoverTab() {
const [currentUser, setCurrentUser] = useState<any>(null);
const [users, setUsers] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [selectedUser, setSelectedUser] = useState<any>(null);

useEffect(() => {
if (auth.currentUser) setCurrentUser(auth.currentUser);
}, [auth.currentUser]);

useEffect(() => {
if (!currentUser) return;

const fetchUsers = async () => {
try {
const snap = await getDocs(collection(db, "users"));
const currentSnap = await getDoc(doc(db, "users", currentUser.uid));
const currentData = currentSnap.data() || {};

const connections: string[] = currentData.connections || [];
const outgoing: string[] = currentData.outgoingRequests || [];

const filtered = snap.docs
.map((d) => ({ id: d.id, ...d.data() }))
.filter((u) => {
if (u.id === currentUser.uid) return false;
if (connections.includes(u.id)) return false;
if (outgoing.includes(u.id)) return false;
return true;
})
.sort(
(a: any, b: any) =>
(b.createdAt?.toMillis?.() || 0) -
(a.createdAt?.toMillis?.() || 0)
);

setUsers(filtered);
} catch (e) {
console.log("Discover load error:", e);
} finally {
setLoading(false);
}
};

fetchUsers();
}, [currentUser]);

const sendStudyRequest = async (targetUser: any) => {
if (!currentUser?.uid) {
console.log("Current user not ready yet");
return;
}

try {
await updateDoc(doc(db, "users", targetUser.id), {
incomingRequests: arrayUnion(currentUser.uid),
});

await updateDoc(doc(db, "users", currentUser.uid), {
outgoingRequests: arrayUnion(targetUser.id),
});

setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
} catch (e) {
console.log("Send request error:", e);
}
};

if (loading) {
return (
<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
<ActivityIndicator size="large" color="#4F46E5" />
</View>
);
}

return (
<View style={{ flex: 1, padding: 16, backgroundColor: "#F9FAFB" }}>
{/* Header */}
<View
style={{
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 12,
}}
>
<Text style={{ fontSize: 22, fontWeight: "800" }}>
Discover Students 🔍
</Text>
</View>

<FlatList
data={users}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<View
style={{
backgroundColor: "#FFF",
padding: 16,
borderRadius: 16,
marginBottom: 12,
}}
>
<Text style={{ fontSize: 16, fontWeight: "700" }}>
{item.name || "Student"}
</Text>

<Text style={{ color: "#6B7280", marginBottom: 6 }}>
Grade {item.grade ?? "-"} • {item.school ?? "-"}
</Text>

<Text style={{ color: "#4F46E5", marginBottom: 10 }}>
{item.subjects?.slice(0, 3).join(", ")}
{item.subjects?.length > 3 ? " +" : ""}
</Text>

<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
<TouchableOpacity
onPress={() => sendStudyRequest(item)}
style={{
backgroundColor: "#4F46E5",
paddingVertical: 10,
paddingHorizontal: 16,
borderRadius: 12,
}}
>
<Text style={{ color: "#FFF", fontWeight: "600" }}>
Study Together
</Text>
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
<Text style={{ color: "#111827", fontWeight: "500" }}>
View Profile
</Text>
</TouchableOpacity>
</View>
</View>
)}
ListEmptyComponent={
<View style={{ alignItems: "center", marginTop: 40 }}>
<Text style={{ color: "#6B7280", marginBottom: 12 }}>
😕 No students here yet
</Text>
</View>
}
/>

<StudentProfileSheet
visible={!!selectedUser}
user={selectedUser}
onClose={() => setSelectedUser(null)}
/>
</View>
);
}