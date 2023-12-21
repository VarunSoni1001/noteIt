import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { app } from "@/utils/firebase";
import toast from "react-hot-toast";

const auth = getAuth(app);

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  logInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<void>;
  continueWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // For Authentication with Email and Password

  const logInWithEmailAndPassword = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
        toast.success("You are successfully logged in!");
      });
    } catch (error: any) {
      toast.error("Error logging in! " + error.message.split(":")[1]);
    }
    setLoading(false);
  };

  const signUpWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(() => {
        toast.success("Your account has been successfully created!");
      });
    } catch (error: any) {
      toast.error("Error signing up! " + error.message.split(":")[1]);
    }
    setLoading(false);
  };

  // For Authentication with google

  const continueWithGoogle = async () => {
    const googleAuth = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, googleAuth).then(() => {
        toast.success("You are successfully logged in!");
      });
    } catch (error: any) {
      toast.error(
        "Error in Logging in with Google Auth! " + error.message.split(":")[1]
      );
    }
    setLoading(false);
  };

  // For Logout

  const logout = async () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        await signOut(auth).then(() => {
          toast.success("Your account has been logged out successfully!");
        });
      } catch (error: any) {
        toast.error("Error logging out! " + error.message.split(":")[1]);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const contextValue: AuthContextProps = {
    user,
    loading,
    logInWithEmailAndPassword,
    signUpWithEmailAndPassword,
    continueWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
