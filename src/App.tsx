import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { dark } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScanProvider } from "@/lib/scan-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Result from "@/pages/result";
import History from "@/pages/history";
import Purchase from "@/pages/purchase";
import Landing from "@/pages/landing";
import { AppLayout } from "@/components/app-layout";

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  baseTheme: dark,
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "#6366f1",
    colorBackground: "#0f0f14",
    colorForeground: "#f1f5f9",
    colorMutedForeground: "#94a3b8",
    colorDanger: "#ef4444",
    colorInput: "#1a1a2e",
    colorInputForeground: "#f1f5f9",
    colorNeutral: "#334155",
    fontFamily: "'Outfit', sans-serif",
    borderRadius: "12px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#0f0f14] border border-white/10 rounded-2xl w-[440px] max-w-full overflow-hidden shadow-2xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-white font-bold text-2xl",
    headerSubtitle: "text-slate-400",
    socialButtonsBlockButtonText: "text-white font-medium",
    socialButtonsBlockButton: "!border-white/10 !bg-white/5 hover:!bg-white/10",
    formFieldLabel: "text-slate-300 font-medium",
    formFieldInput: "!bg-white/5 !border-white/10 !text-white",
    formButtonPrimary: "!bg-indigo-500 hover:!bg-indigo-600 !font-semibold",
    footerActionText: "text-slate-400",
    footerActionLink: "text-indigo-400 hover:text-indigo-300",
    dividerText: "text-slate-500",
    dividerLine: "!bg-white/10",
    identityPreviewEditButton: "text-indigo-400",
    formFieldSuccessText: "text-emerald-400",
    alertText: "text-red-400",
    logoBox: "mb-2",
    logoImage: "w-10 h-10",
    footerAction: "border-t border-white/10",
    otpCodeFieldInput: "!bg-white/5 !border-white/10 !text-white",
    formFieldRow: "gap-2",
    main: "gap-4",
    alert: "!bg-red-500/10 !border-red-500/20",
  },
};

const PREVIEW_MODE = import.meta.env.DEV && import.meta.env.VITE_PREVIEW_MODE !== "false";

function useUserAccess() {
  const { isSignedIn, isLoaded } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["user-me"],
    queryFn: async () => {
      const res = await fetch(`${basePath}/api/user/me`, { credentials: "include" });
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

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        appearance={clerkAppearance}
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        appearance={clerkAppearance}
      />
    </div>
  );
}

function HomeRedirect() {
  const { isLoaded, isSignedIn, hasActiveSubscription } = useUserAccess();

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

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <ScanProvider>
            <Switch>
              <Route path="/" component={HomeRedirect} />
              <Route path="/sign-in/*?" component={SignInPage} />
              <Route path="/sign-up/*?" component={SignUpPage} />
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
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
