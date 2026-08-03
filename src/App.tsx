import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScanProvider } from "@/lib/scan-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Result from "@/pages/result";
import History from "@/pages/history";
import Purchase from "@/pages/purchase";
import Landing from "@/pages/landing";
import { SignInPage, SignUpPage } from "@/pages/sign-in";
import { AppLayout } from "@/components/app-layout";

const queryClient = new QueryClient();

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const PREVIEW_MODE = import.meta.env.DEV && import.meta.env.VITE_PREVIEW_MODE !== "false";

function useUserAccess() {
  const { isSignedIn, isLoaded } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["user-me"],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${basePath}/api/user/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) return null;
      return res.json() as Promise<{ id: string; email: string | null; hasActiveSubscription: boolean }>;
    },
    enabled: isSignedIn === true,
    staleTime: 30_000,
  });
  if (PREVIEW_MODE) {
    return { isLoaded: true, isSignedIn: true, hasActiveSubscription: true };
  }
  return {
    isLoaded: isLoaded && (!isSignedIn || !isLoading),
    isSignedIn: isSignedIn ?? false,
    hasActiveSubscription: data?.hasActiveSubscription ?? false,
  };
}

function HomeRedirect() {
  const { isLoaded, isSignedIn } = useUserAccess();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return <Landing />;
  return (
    <AppLayout>
      <Home />
    </AppLayout>
  );
}

function SignedInRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUserAccess();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return <Redirect to="/sign-in" />;
  return <AppLayout>{children}</AppLayout>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, hasActiveSubscription } = useUserAccess();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return <Redirect to="/sign-in" />;
  if (!hasActiveSubscription) return <Redirect to="/purchase" />;
  return <AppLayout>{children}</AppLayout>;
}

function PurchaseRoute() {
  const { isLoaded, isSignedIn, hasActiveSubscription } = useUserAccess();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return <Redirect to="/sign-in" />;
  if (hasActiveSubscription) return <Redirect to="/" />;
  return <Purchase />;
}

function AuthQueryClientCacheInvalidator() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const userId = user?.uid ?? null;
    if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
      qc.clear();
    }
    prevUserIdRef.current = userId;
  }, [user, qc]);

  return null;
}

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthQueryClientCacheInvalidator />
      <TooltipProvider>
        <ScanProvider>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in" component={SignInPage} />
            <Route path="/sign-up" component={SignUpPage} />
            <Route path="/purchase" component={PurchaseRoute} />
            <Route path="/result">
              {() => (
                <SignedInRoute>
                  <Result />
                </SignedInRoute>
              )}
            </Route>
            <Route path="/history">
              {() => (
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              )}
            </Route>
            <Route component={NotFound} />
          </Switch>
        </ScanProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </WouterRouter>
  );
}

export default App;
