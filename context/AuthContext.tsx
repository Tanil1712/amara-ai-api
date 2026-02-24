
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type AuthContextType = {
user: User | null;
profile: any | null;
loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
user: null,
profile: null,
loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<User | null>(null);
const [profile, setProfile] = useState<any | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const unsub = onAuthStateChanged(auth, async (u) => {
setUser(u);

try {
if (u) {
const snap = await getDoc(doc(db, "users", u.uid));
setProfile(snap.exists() ? snap.data() : null);
} else {
setProfile(null);
}
} catch (error) {
console.log("Auth profile load error:", error);
setProfile(null);
} finally {
setLoading(false);
}
});

return unsub;
}, []);

return (
<AuthContext.Provider value={{ user, profile, loading }}>
{children}
</AuthContext.Provider>
);
}

export const useAuth = () => useContext(AuthContext);