import { useState, FormEvent } from "react";
import { Link } from "wouter";
import { Film, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/hooks/use-toast";

function firebaseErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account already exists with this email.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);

  const isSignUp = mode === "sign-up";

  const handleGoogle = async () => {
    setLoading("google");
    try {
      await signInWithGoogle();
    } catch (err) {
      toast({ title: "Sign in failed", description: firebaseErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading("email");
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      toast({ title: "Authentication failed", description: firebaseErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="w-[440px] max-w-full rounded-2xl border border-white/10 bg-[#0f0f14] p-8 shadow-2xl">
      <div className="flex flex-col items-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
          <Film className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-white">{isSignUp ? "Create your account" : "Welcome back"}</h1>
        <p className="text-sm text-slate-400 mt-1">
          {isSignUp ? "Start identifying anything you watch" : "Sign in to continue to Videofy"}
        </p>
      </div>

      <button
        onClick={handleGoogle}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium py-3 mb-4 transition-colors disabled:opacity-60"
      >
        {loading === "google" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.87c2.27-2.09 3.58-5.17 3.58-8.8z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.87-3.01c-1.07.72-2.45 1.15-4.08 1.15-3.14 0-5.8-2.12-6.75-4.97H1.26v3.11C3.24 21.3 7.28 24 12 24z" />
            <path fill="#FBBC05" d="M5.25 14.27a7.2 7.2 0 010-4.54v-3.1H1.26a12 12 0 000 10.75l3.99-3.11z" />
            <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.28 0 3.24 2.7 1.26 6.63l3.99 3.1C6.2 6.88 8.86 4.75 12 4.75z" />
          </svg>
        )}
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-slate-500">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-sm text-slate-300 font-medium block mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300 font-medium block mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/10 text-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 mt-1 transition-colors disabled:opacity-60"
        >
          {loading === "email" && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6 pt-6 border-t border-white/10">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300">Sign up</Link>
          </>
        )}
      </p>
    </div>
  );
}

export function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <AuthForm mode="sign-in" />
    </div>
  );
}

export function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <AuthForm mode="sign-up" />
    </div>
  );
}
