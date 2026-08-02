import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, History as HistoryIcon, LogOut, User } from "lucide-react";
import { useClerk, useUser } from "@clerk/react";
import { cn } from "@/lib/utils";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground dark">
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">Videofy</span>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs text-muted-foreground hidden sm:block truncate max-w-[140px]">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          )}
          <button
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pt-14 pb-20 relative overflow-hidden">
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
        <div className="relative z-10 h-full">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-border/50 bg-background/80 backdrop-blur-xl px-6">
        <Link href="/">
          <div className={cn("flex flex-col items-center gap-1 transition-colors", location === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            <div className={cn("rounded-full p-2", location === "/" && "bg-primary/10")}>
              <Home className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-medium tracking-wide">Scan</span>
          </div>
        </Link>
        <Link href="/history">
          <div className={cn("flex flex-col items-center gap-1 transition-colors", location === "/history" ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
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
