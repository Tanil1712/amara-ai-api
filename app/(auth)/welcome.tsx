import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
export default function Welcome() {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>EduBox</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:"center", alignItems:"center" },
  logo:{ width:100, height:100, marginBottom:20 },
  title:{ fontSize:32, fontWeight:"bold", marginBottom:40 },
  button:{ backgroundColor:"#2563eb", padding:15, borderRadius:8, width:"80%" },
  buttonText:{ color:"#fff", textAlign:"center", fontSize:16 },
  link:{ marginTop:20, color:"#2563eb" }
});