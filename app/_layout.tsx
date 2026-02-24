
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
const { user, loading } = useAuth();

useEffect(() => {
if (!loading) {
SplashScreen.hideAsync();
}
}, [loading]);

if (loading) {
return (
<View
style={{
flex: 1,
backgroundColor: "#ffffff",
justifyContent: "center",
alignItems: "center",
}}
>
<ActivityIndicator size="large" color="#4F46E5" />
</View>
);
}

return (
<Stack
screenOptions={{
headerShown: false,
animation: "fade",
}}
>
{!user ? (
// 🔐 Not logged in → show auth screens
<Stack.Screen name="(auth)" />
) : (
// ✅ Logged in → show main app screens
<>
<Stack.Screen name="index" />
<Stack.Screen name="home" />
<Stack.Screen name="discover" />
<Stack.Screen name="studentlink" />
<Stack.Screen name="homework" />
</>
)}
</Stack>
);
}

export default function RootLayout() {
return (
<AuthProvider>
<StatusBar style="dark" />
<RootNavigator />
</AuthProvider>
);
}