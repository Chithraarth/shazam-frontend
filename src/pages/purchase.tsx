import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Film, Sparkles, Globe, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const FEATURES = [
  "Instant movie & TV show identification",
  "Works with any screen — camera or upload",
  "Bollywood, Hollywood, K-Drama, Anime & more",
  "Full cast, director, platform & episode details",
  "Identification history saved while subscribed",
  "All future updates included",
];

export default function Purchase() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${basePath}/api/stripe/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground dark flex flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Film className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">Unlock Videofy</span>
          </h1>
          {user && (
            <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
          )}
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur p-6 mb-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Yearly Plan</p>
              <p className="text-4xl font-extrabold text-foreground mt-1">
                ₹799<span className="text-lg font-semibold text-muted-foreground">/year</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Billed yearly — cancel anytime</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>All languages</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Instant access</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 mb-6">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-foreground/90">{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting to checkout...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Subscribe — ₹799/year
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Powered by Stripe · Secure payments · 30-day refund policy
        </p>
      </motion.div>
    </div>
  );
}
