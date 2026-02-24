import { View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
export default function NetworkGuard({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const unsub = NetInfo.addEventListener(state => {
      setOnline(!!state.isConnected);
    });
    return () => unsub();
  }, []);
  if (!online) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    );
  }
  return <>{children}</>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 16,
    color: "red"
  }
});