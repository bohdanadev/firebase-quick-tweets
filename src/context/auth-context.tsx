// "use client";
// import { IUser } from "@/types";
// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
// } from "react";
// import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
// import { app } from "@/lib/firebase/firebase";
// import { getAuth, onAuthStateChanged, User } from "firebase/auth";
// import { getUser } from "@/lib/firebase/user";
// import { useRouter } from "next/navigation";

// type AuthContextType = {
//   user: User | null;
//   setAuthUserContext: (user: User) => void;
//   setAuthContextNull: () => void;
//   signInWithGoogle: () => void;
//   signOut: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const setAuthUserContext = (user: User) => setUser(user);
//   const setAuthContextNull = () => setUser(null);
//   const router = useRouter();

//   const auth = getAuth(app);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         // const user = await getUser(currentUser.uid);
//         setUser(currentUser);
//         setLoading(false);
//       } else {
//         setUser(null);
//         router.push("/?mode=login");
//       }
//     });
//     return () => unsubscribe();
//   }, [auth]);
//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setAuthContextNull,
//         setAuthUserContext,
//         signInWithGoogle,
//         signOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
