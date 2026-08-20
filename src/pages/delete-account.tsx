import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function DeleteAccount() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground dark">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <button
          onClick={() => setLocation("/")}
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Videofy
        </button>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Delete Your Videofy Account
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          How to request deletion of your Videofy account and associated data.
        </p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h2 className="text-foreground font-bold text-base mb-3">
              Option 1 — Request deletion by email
            </h2>
            <p className="text-muted-foreground mb-3">
              Send an email to{" "}
              <a href="mailto:support@videofy.co.in?subject=Delete%20my%20Videofy%20account" className="text-primary hover:underline">
                support@videofy.co.in
              </a>{" "}
              from the email address linked to your Videofy account, with the subject line
              "Delete my Videofy account". We'll process your request within 30 days.
            </p>
          </section>

          <section className="rounded-xl border border-border/50 bg-card/30 p-5">
            <h2 className="text-foreground font-bold text-base mb-3">
              What gets deleted
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Your account and sign-in information (email, phone number)</li>
              <li>Your scan history and any saved preferences</li>
              <li>Your remaining scan credit balance</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Records of past purchases may be retained as required for financial and legal
              record-keeping, even after your account is deleted.
            </p>
          </section>

          <p className="text-xs text-muted-foreground">
            For more on what data we collect and how it's used, see our{" "}
            <button onClick={() => setLocation("/privacy")} className="text-primary hover:underline">
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
