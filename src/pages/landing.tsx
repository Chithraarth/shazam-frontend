import { useClerk } from "@clerk/react";
import { motion } from "framer-motion";
import { Film, Sparkles, ShieldCheck, Zap } from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Landing() {
  const { openSignIn, openSignUp } = useClerk();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground dark flex flex-col">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-60" />

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <Film className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">Videofy</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Point your camera at any screen — instantly identify movies, TV shows, and episodes from any country or language.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 w-full max-w-lg"
        >
          {[
            { icon: Sparkles, label: "AI-Powered", desc: "Gemini Vision AI" },
            { icon: Zap, label: "Instant Results", desc: "Under 3 seconds" },
            { icon: ShieldCheck, label: "Just ₹799/year", desc: "Cancel anytime" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-border/50 bg-card/30 p-4 backdrop-blur">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
        >
          <button
            onClick={() => openSignUp()}
            className="flex-1 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            Start Scanning Free
          </button>
          <button
            onClick={() => openSignIn()}
            className="flex-1 rounded-xl border border-border bg-card/50 px-6 py-3.5 text-base font-semibold text-foreground hover:bg-card transition-all active:scale-95"
          >
            Sign In
          </button>
        </motion.div>

        <p className="mt-6 text-xs text-muted-foreground">
          Scan for free · Unlock answers for just ₹799/year
        </p>
      </div>
    </div>
  );
}
