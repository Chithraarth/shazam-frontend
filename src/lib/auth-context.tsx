import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as firebaseSignOut,
  User,
  ConfirmationResult,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { setAuthTokenGetter } from "@/api-client";

type AuthContextValue = {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  renderRecaptcha: (recaptchaContainerId: string) => Promise<void>;
  sendPhoneOtp: (phoneNumber: string) => Promise<ConfirmationResult>;
  confirmPhoneOtp: (confirmation: ConfirmationResult, code: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

setAuthTokenGetter(() => auth.currentUser?.getIdToken() ?? null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsLoaded(true);
    });
  }, []);

  const value: AuthContextValue = {
    user,
    isLoaded,
    isSignedIn: !!user,
    signInWithGoogle: async () => {
      await signInWithPopup(auth, googleProvider);
    },
    signInWithEmail: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signUpWithEmail: async (email, password) => {
      await createUserWithEmailAndPassword(auth, email, password);
    },
    renderRecaptcha: async (recaptchaContainerId) => {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, recaptchaContainerId, {
          size: "normal",
        });
        await recaptchaRef.current.render();
      }
    },
    sendPhoneOtp: async (phoneNumber) => {
      if (!recaptchaRef.current) {
        throw new Error("Recaptcha not ready yet");
      }
      return signInWithPhoneNumber(auth, phoneNumber, recaptchaRef.current);
    },
    confirmPhoneOtp: async (confirmation, code) => {
      await confirmation.confirm(code);
    },
    signOut: async () => {
      await firebaseSignOut(auth);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
