import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function Privacy() {
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

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: August 19, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h2]:font-bold [&_h2]:text-base [&_h2]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1">
          <section>
            <h2>1. What this policy covers</h2>
            <p>
              This Privacy Policy explains what information Videofy collects, how it's used, and
              your choices, when you use our app or website.
            </p>
          </section>

          <section>
            <h2>2. Information we collect</h2>
            <p>
              <strong>Account information:</strong> your email address and a unique account ID,
              created via Google Sign-In, phone number verification, or email/password (handled by
              Firebase Authentication).
            </p>
            <p>
              <strong>Photos and screen captures you submit:</strong> when you scan a screen,
              upload a photo, or select a frame from a recording, that image is sent to our
              backend and to Google's Gemini AI service for identification. We do not use these
              images to train AI models, and video recordings themselves are never uploaded or
              stored — only the single extracted frame needed for identification.
            </p>
            <p>
              <strong>Usage data:</strong> your scan history, remaining scan credits, and basic
              preferences (country, language, content regions) so the app can personalize results
              and show your past scans.
            </p>
            <p>
              <strong>Purchase information:</strong> when you buy a scan pack, Google Play
              processes the payment. We receive a purchase confirmation token from Google to verify
              and credit your account — we never see or store your card details.
            </p>
          </section>

          <section>
            <h2>3. How we use your information</h2>
            <ul>
              <li>To identify the movie, show, or clip in an image you submit;</li>
              <li>To maintain your account, scan history, and scan credit balance;</li>
              <li>To verify purchases and grant the scan credits you paid for;</li>
              <li>To personalize results to your country, language, and content preferences;</li>
              <li>To keep the service secure and prevent abuse.</li>
            </ul>
          </section>

          <section>
            <h2>4. Who we share information with</h2>
            <p>We share limited data with the following third parties, solely to run the app:</p>
            <ul>
              <li>
                <strong>Google Gemini API</strong> — receives the image you submit, to identify
                its content;
              </li>
              <li>
                <strong>Firebase (Google)</strong> — handles sign-in and authentication;
              </li>
              <li>
                <strong>Google Play Billing</strong> — processes scan-pack purchases;
              </li>
            </ul>
            <p>We do not sell your personal information to anyone.</p>
          </section>

          <section>
            <h2>5. Data retention</h2>
            <p>
              We retain your account data and scan history for as long as your account is active.
              You can request deletion of your account and associated data at any time by
              contacting us.
            </p>
          </section>

          <section>
            <h2>6. Your choices</h2>
            <ul>
              <li>You can update your preferences (country, language, content regions) anytime in the app;</li>
              <li>You can sign out or delete your account at any time;</li>
              <li>You can request a copy or deletion of your data by contacting us below.</li>
            </ul>
          </section>

          <section>
            <h2>7. Children's privacy</h2>
            <p>
              Videofy is not directed at children under 13, and we do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2>8. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We'll update the "Last updated"
              date above when we do.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              Questions about this policy or your data? Reach us at{" "}
              <a href="mailto:support@videofy.co.in" className="text-primary hover:underline">
                support@videofy.co.in
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
