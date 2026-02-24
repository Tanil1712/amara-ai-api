import { Tabs } from "expo-router";
import { Users, Inbox, Link2 } from "lucide-react-native";
export default function StudentLinkLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: "StudentLink",
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#F9FAFB",
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "700",
          color: "#111827",
        },
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#FFF",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* Discover Tab */}
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      {/* Requests Tab */}
      <Tabs.Screen
        name="request"
        options={{
          title: "Requests",
          tabBarIcon: ({ color, size }) => <Inbox color={color} size={size} />,
          // Badge example (number only, works with Expo Router)
          // Set dynamically from Firebase later:
          // tabBarBadge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined
          tabBarBadge: undefined,
        }}
      />
      {/* Connected Tab */}
      <Tabs.Screen
        name="connected"
        options={{
          title: "Connected",
          tabBarIcon: ({ color, size }) => <Link2 color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}