import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, History as HistoryIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground dark">
      <main className="flex-1 pb-20 relative overflow-hidden">
        {/* Cinematic background noise/gradient */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
        <div className="relative z-10 h-full">{children}</div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-border/50 bg-background/80 backdrop-blur-xl px-6">
        <Link href="/">
          <div
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              location === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn("rounded-full p-2", location === "/" && "bg-primary/10")}>
              <Home className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-medium tracking-wide">Scan</span>
          </div>
        </Link>
        
        <Link href="/history">
          <div
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              location === "/history" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn("rounded-full p-2", location === "/history" && "bg-primary/10")}>
              <HistoryIcon className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-medium tracking-wide">History</span>
          </div>
        </Link>
      </nav>
    </div>
  );
}
