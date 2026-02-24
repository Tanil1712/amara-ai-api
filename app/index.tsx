import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";
export default function Index() {
  const { user, profile, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  if (!profile) {
    return <Redirect href="/(auth)/profile-setup" />;
  }
  return <Redirect href="/home" />;
}