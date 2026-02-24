
import React, { useState, useRef, useEffect } from "react";
import {
View,
Text,
Modal,
TextInput,
TouchableOpacity,
FlatList,
StyleSheet,
KeyboardAvoidingView,
Platform,
Animated,
Dimensions,
} from "react-native";

////////////////////////////////////////
// TYPES
////////////////////////////////////////

type Props = {
visible: boolean;
onClose: () => void;
contextText?: string;
};

type Message = {
id: string;
role: "user" | "amara";
text: string;
time: number;
};

////////////////////////////////////////
// MAIN COMPONENT
////////////////////////////////////////

export default function AmaraChat({
visible,
onClose,
contextText,
}: Props) {
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState("");
const [sending, setSending] = useState(false);
const [isAtBottom, setIsAtBottom] = useState(true);

const listRef = useRef<FlatList>(null);

const screenHeight = Dimensions.get("window").height;
const sheetHeight = useRef(
new Animated.Value(screenHeight * 0.6)
).current;

////////////////////////////////////////
// Auto Scroll
////////////////////////////////////////
useEffect(() => {
if (isAtBottom) {
setTimeout(() => {
listRef.current?.scrollToEnd({ animated: true });
}, 100);
}
}, [messages, isAtBottom]);

////////////////////////////////////////
// SEND MESSAGE (REAL AI)
////////////////////////////////////////
const sendMessage = async () => {
if (!input.trim() || sending) return;

const userMsg: Message = {
id: Math.random().toString(),
role: "user",
text: input.trim(),
time: Date.now(),
};

setMessages((prev) => [...prev, userMsg]);
setInput("");
setSending(true);

try {
const response = await fetch(
"https://amara-ai-api.vercel.app/api/ask",
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
message: userMsg.text,
context: contextText,
mode: "step_by_step",
}),
}
);

const data = await response.json();

const amaraMsg: Message = {
id: Math.random().toString(),
role: "amara",
text: data.reply || "No response received.",
time: Date.now(),
};

setMessages((prev) => [...prev, amaraMsg]);
} catch (error) {
const errorMsg: Message = {
id: Math.random().toString(),
role: "amara",
text: "⚠️ AI error. Please try again.",
time: Date.now(),
};

setMessages((prev) => [...prev, errorMsg]);
}

setSending(false);
};

////////////////////////////////////////
// Render Message
////////////////////////////////////////
const renderItem = ({ item }: { item: Message }) => (
<View
style={[
styles.msgBubble,
item.role === "user" ? styles.user : styles.amara,
]}
>
<Text style={styles.msgText}>{item.text}</Text>
</View>
);

////////////////////////////////////////
// Quick Suggestions
////////////////////////////////////////
const suggestions = [
"Explain formula",
"Give an example",
"Summarize this topic",
"Check my answer",
];

////////////////////////////////////////
// UI
////////////////////////////////////////
return (
<Modal visible={visible} animationType="slide" transparent>
<KeyboardAvoidingView
style={styles.container}
behavior={Platform.OS === "ios" ? "padding" : undefined}
>
<Animated.View style={[styles.sheet, { height: sheetHeight }]}>
{/* Header */}
<View style={styles.header}>
<Text style={styles.title}>Amara</Text>
<TouchableOpacity onPress={onClose}>
<Text style={styles.close}>Close</Text>
</TouchableOpacity>
</View>

{/* Context */}
{contextText ? (
<View style={styles.contextBox}>
<Text style={styles.contextText}>{contextText}</Text>
</View>
) : null}

{/* Messages */}
<FlatList
ref={listRef}
data={messages}
renderItem={renderItem}
keyExtractor={(item) => item.id}
contentContainerStyle={{ padding: 16 }}
onScroll={(e) => {
const { layoutMeasurement, contentOffset, contentSize } =
e.nativeEvent;
setIsAtBottom(
layoutMeasurement.height + contentOffset.y >=
contentSize.height - 20
);
}}
/>

{/* Suggestions */}
<View style={styles.suggestions}>
{suggestions.map((s) => (
<TouchableOpacity
key={s}
style={styles.suggestionBtn}
onPress={() => {
setInput(s);
}}
>
<Text style={styles.suggestionText}>{s}</Text>
</TouchableOpacity>
))}
</View>

{/* Input */}
<View style={styles.inputRow}>
<TextInput
value={input}
onChangeText={setInput}
placeholder="Ask Amara anything..."
style={styles.input}
editable={!sending}
multiline
/>
<TouchableOpacity
onPress={sendMessage}
style={[styles.sendBtn, sending && { opacity: 0.5 }]}
>
<Text style={styles.sendText}>
{sending ? "..." : "Send"}
</Text>
</TouchableOpacity>
</View>
</Animated.View>
</KeyboardAvoidingView>
</Modal>
);
}

////////////////////////////////////////
// STYLES (UNCHANGED)
////////////////////////////////////////

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: "flex-end",
backgroundColor: "rgba(0,0,0,0.3)",
},
sheet: {
backgroundColor: "#0f172a",
borderTopLeftRadius: 20,
borderTopRightRadius: 20,
overflow: "hidden",
},
header: {
paddingTop: 20,
paddingBottom: 12,
paddingHorizontal: 20,
backgroundColor: "#020617",
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
},
title: {
color: "white",
fontSize: 22,
fontWeight: "700",
},
close: {
color: "#38bdf8",
fontSize: 16,
},
contextBox: {
backgroundColor: "#1e293b",
padding: 12,
marginHorizontal: 16,
marginTop: 10,
borderRadius: 10,
},
contextText: {
color: "#38bdf8",
fontSize: 14,
},
msgBubble: {
padding: 12,
borderRadius: 14,
marginBottom: 10,
maxWidth: "80%",
},
user: {
backgroundColor: "#2563eb",
alignSelf: "flex-end",
},
amara: {
backgroundColor: "#1e293b",
alignSelf: "flex-start",
},
msgText: {
color: "white",
fontSize: 15,
},
inputRow: {
flexDirection: "row",
padding: 12,
backgroundColor: "#020617",
},
input: {
flex: 1,
backgroundColor: "#1e293b",
color: "white",
paddingHorizontal: 12,
borderRadius: 10,
minHeight: 40,
maxHeight: 100,
},
sendBtn: {
marginLeft: 10,
backgroundColor: "#38bdf8",
paddingHorizontal: 16,
justifyContent: "center",
borderRadius: 10,
},
sendText: {
fontWeight: "600",
},
suggestions: {
flexDirection: "row",
flexWrap: "wrap",
paddingHorizontal: 16,
marginBottom: 8,
},
suggestionBtn: {
backgroundColor: "#2563eb",
paddingHorizontal: 10,
paddingVertical: 6,
borderRadius: 12,
marginRight: 6,
marginBottom: 6,
},
suggestionText: {
color: "white",
fontSize: 13,
},
});