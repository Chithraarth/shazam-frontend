import { Link } from "wouter";
import type { ReactNode } from "react";
import "./landing.css";

// Store listings. Override with VITE_APP_STORE_URL / VITE_PLAY_STORE_URL.
const APP_STORE_URL = import.meta.env.VITE_APP_STORE_URL || "https://apps.apple.com/app/id6818978662";
const PLAY_STORE_URL =
  import.meta.env.VITE_PLAY_STORE_URL || "https://play.google.com/store/apps/details?id=com.videofy.app";

function Check({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#C6FF3D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

function StoreButtons({ variant = "default" }: { variant?: "default" | "onGradient" }) {
  const onGradient = variant === "onGradient";
  return (
    <div className="vl-row" style={onGradient ? { justifyContent: "center" } : undefined}>
      <a
        className={`vl-store ${onGradient ? "" : "vl-store-g"}`}
        style={onGradient ? { background: "#fff", color: "#16111F" } : undefined}
        href={APP_STORE_URL}
        target="_blank"
        rel="noreferrer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <path d="M11 18h2" />
        </svg>
        <span><small>Download on the</small>App Store</span>
      </a>
      <a
        className={`vl-store ${onGradient ? "" : "vl-store-s"}`}
        style={onGradient ? { background: "rgba(13,11,20,.35)", color: "#fff", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.4)" } : undefined}
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noreferrer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 3l13 9-13 9V3z" />
        </svg>
        <span><small>Get it on</small>Google Play</span>
      </a>
    </div>
  );
}

function Logo() {
  return (
    <span className="vl-logo">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
        <path d="M4 9V6a2 2 0 0 1 2-2h3M15 4h3a2 2 0 0 1 2 2v3M20 15v3a2 2 0 0 1-2 2h-3M9 20H6a2 2 0 0 1-2-2v-3" />
        <circle cx="12" cy="12" r="2.4" fill="#C6FF3D" stroke="none" />
      </svg>
    </span>
  );
}

function PhoneMockup() {
  const corner = (pos: "tl" | "tr" | "bl" | "br") => {
    const color = pos[0] === "t" ? "#FF5CAD" : "#F0600A";
    const v = pos[0] === "t" ? { top: 0, borderTop: `4px solid ${color}` } : { bottom: 0, borderBottom: `4px solid ${color}` };
    const h = pos[1] === "l" ? { left: 0, borderLeft: `4px solid ${color}` } : { right: 0, borderRight: `4px solid ${color}` };
    const r = { tl: "borderTopLeftRadius", tr: "borderTopRightRadius", bl: "borderBottomLeftRadius", br: "borderBottomRightRadius" }[pos];
    return <div className="vl-corner" style={{ ...v, ...h, [r]: 12 }} />;
  };
  return (
    <div className="vl-stage" aria-hidden="true">
      <div className="vl-glow" />
      <div className="vl-phone">
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#2B1B45 0%,#5A1E4C 45%,#8A3B1C 100%)" }} />
        <div style={{ position: "absolute", left: 16, top: 22, height: 34, padding: "0 12px 0 4px", borderRadius: 17, background: "rgba(13,11,20,.6)", display: "flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 800, fontSize: 12 }}>
          <span style={{ minWidth: 24, height: 24, borderRadius: 12, background: "var(--grad)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>43</span>
          scans left
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, top: 110, bottom: 190 }}>
          {corner("tl")}
          {corner("tr")}
          {corner("bl")}
          {corner("br")}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div className="vl-dsp" style={{ width: 104, height: 104, borderRadius: 52, background: "rgba(13,11,20,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 44 }}>12</div>
            <div style={{ padding: "7px 12px", borderRadius: 14, background: "rgba(13,11,20,.6)", textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>Hold steady on the screen</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>2 frames captured</div>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 104, display: "flex", justifyContent: "center", gap: 18, fontWeight: 800, fontSize: 10, letterSpacing: ".08em", color: "rgba(255,255,255,.65)" }}>
          <span>PHOTO</span>
          <span style={{ color: "#fff" }}>CAMERA</span>
          <span>SCAN BACKGROUND</span>
        </div>
        <div style={{ position: "absolute", left: 14, right: 14, bottom: 18, height: 64, borderRadius: 32, background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", color: "#62576F", fontWeight: 700, fontSize: 11 }}>
          <span>History</span>
          <span style={{ width: 62, height: 62, borderRadius: 31, background: "var(--grad)", marginTop: -36, boxShadow: "0 0 0 6px #fff" }} />
          <span>Me</span>
        </div>
      </div>
      <div className="vl-card vl-found">
        <div style={{ width: 52, height: 72, borderRadius: 12, background: "var(--grad)", flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".1em", color: "var(--acc)" }}>FOUND IT</div>
          <div className="vl-dsp" style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.15 }}>Cast, episode &amp; where to watch</div>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { n: "01", title: "Point at the screen", body: "TV, laptop, a friend’s phone — fill the frame with whatever is playing." },
  { n: "02", title: "Hold for 15 seconds", body: "Videofy takes a frame every few seconds so it catches title cards, faces and captions." },
  { n: "03", title: "Get the answer", body: "The title, cast, episode and the app it’s streaming on — saved to your history." },
];

const WAYS: { title: string; body: string; tag: string; icon: ReactNode }[] = [
  {
    title: "Camera",
    body: "For a TV, laptop or any screen near you. A 15-second scan with the back camera.",
    tag: "15 SEC",
    icon: (
      <>
        <path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
  },
  {
    title: "Photo",
    body: "Already took a screenshot? Pick it, crop away captions and buttons, and scan.",
    tag: "SCREENSHOTS",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="9" cy="10" r="2" />
        <path d="M21 16l-5-5-9 9" />
      </>
    ),
  },
  {
    title: "Scan background",
    body: "Watching on this phone? Start a background scan, open the video, and get the answer as a notification.",
    tag: "WHILE YOU WATCH",
    icon: (
      <>
        <circle cx="12" cy="12" r="2" />
        <path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19a10 10 0 0 1 0-14" />
      </>
    ),
  },
];

const GETS = [
  { title: "Title, year and type", body: "Movie, series episode, or the creator behind a reel." },
  { title: "Cast and crew", body: "Who’s in it, who directed it, who did the music." },
  { title: "Where to watch", body: "The streaming apps it’s on in your country, one tap away." },
];

const WORKS_WITH = ["Instagram Reels", "YouTube", "YouTube Shorts", "Netflix", "Prime Video", "JioHotstar", "Facebook", "Smart TV", "Laptop", "Cinema trailers"];

const PRIVACY: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Only when you tap",
    body: "The camera and screen are used only during a scan you start.",
    icon: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="3" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
  {
    title: "No video, no sound",
    body: "A few still frames are sent to identify the clip — never a recording or audio.",
    icon: (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.6 5.1A10 10 0 0 1 22 12a14 14 0 0 1-3.2 4.1M6.3 6.3A14 14 0 0 0 2 12a10 10 0 0 0 13.7 5.7" />
      </>
    ),
  },
  {
    title: "Delete anytime",
    body: "Clear your history in the app, or delete your account and its data.",
    icon: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  },
];

const FAQ = [
  { q: "What can Videofy identify?", a: "Movies, web series and TV episodes, and the creators behind Instagram Reels and YouTube Shorts — in any language." },
  { q: "What counts as a scan?", a: "One scan is one identification, found or not. If something fails on our side — or the scan never reaches us — the scan is given back." },
  { q: "Is there a free trial?", a: "No. Scans come in one-time packs of 50 for ₹499, with no subscription. Unused scans never expire." },
  { q: "How does Scan background work?", a: "Start it in Videofy, open the app that’s playing the video, and Videofy watches the screen for 15 seconds. The answer arrives as a notification." },
  { q: "Do my scans work on both phones?", a: "Yes. Your scans belong to your account, so a pack bought on Android works on your iPhone too, and the other way round." },
];

export default function Landing() {
  return (
    <div className="vl">
      <header className="vl-wrap vl-nav">
        <a href="#top" className="vl-brand">
          <Logo />
          <span className="vl-dsp" style={{ fontWeight: 800, fontSize: 22 }}>videofy</span>
        </a>
        <nav aria-label="Main" className="vl-links">
          <a className="vl-navlink vl-hide-sm" href="#how">How it works</a>
          <a className="vl-navlink vl-hide-sm" href="#ways">Ways to scan</a>
          <a className="vl-navlink vl-hide-sm" href="#pricing">Pricing</a>
          <a className="vl-navlink vl-hide-sm" href="#faq">FAQ</a>
          <Link className="vl-navlink" href="/sign-in">Sign in</Link>
          <a className="vl-store vl-store-g vl-store-sm" href="#download">Get the app</a>
        </nav>
      </header>

      <main>
        <section id="top" className="vl-wrap vl-hero">
          <div style={{ flex: "1 1 460px", minWidth: 0 }}>
            <span className="vl-sticker" style={{ transform: "rotate(-3deg)" }}>MOVIES · SHOWS · REELS</span>
            <h1 className="vl-dsp">What’s that <span className="vl-gt">clip?</span></h1>
            <p className="vl-lead" style={{ fontSize: 20 }}>
              Point your phone at any screen. In 15 seconds Videofy tells you the movie, show or reel — with the cast, the episode and where to watch it.
            </p>
            <div id="download" style={{ marginTop: 34 }}>
              <StoreButtons />
            </div>
            <div className="vl-ticks">
              <span><Check />No subscription</span>
              <span><Check />Failed scans are refunded</span>
              <span><Check />Android &amp; iPhone</span>
            </div>
          </div>
          <PhoneMockup />
        </section>

        <section id="how" className="vl-sec vl-alt">
          <div className="vl-wrap">
            <p className="vl-kick">How it works</p>
            <h2 className="vl-h2">Three taps. <span className="vl-gt">One answer.</span></h2>
            <div className="vl-grid3">
              {STEPS.map((s) => (
                <div key={s.n} className="vl-card vl-step">
                  <div className="vl-dsp vl-gt" style={{ fontWeight: 800, fontSize: 56, lineHeight: 1 }}>{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ways" className="vl-sec">
          <div className="vl-wrap">
            <p className="vl-kick">Ways to scan</p>
            <h2 className="vl-h2">However it’s <span className="vl-gt">playing.</span></h2>
            <p className="vl-lead">On another screen, on your own phone, or already in your camera roll.</p>
            <div className="vl-grid3">
              {WAYS.map((w) => (
                <div key={w.title} className="vl-card vl-way">
                  <div className="vl-ico">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{w.icon}</svg>
                  </div>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                  <span className="vl-sticker" style={{ alignSelf: "flex-start", marginTop: "auto" }}>{w.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="vl-sec vl-alt">
          <div className="vl-wrap vl-split">
            <div style={{ flex: "1 1 420px", minWidth: 0 }}>
              <p className="vl-kick">What you get</p>
              <h2 className="vl-h2">More than <span className="vl-gt">a name.</span></h2>
              <p className="vl-lead">Every answer comes with what you need to start watching.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 34 }}>
                {GETS.map((g, i) => (
                  <div key={g.title} className="vl-point">
                    <span className="vl-sticker" style={{ width: 34, padding: 0, flexShrink: 0 }}>{i + 1}</span>
                    <div>
                      <b>{g.title}</b>
                      <span>{g.body}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: "1 1 380px", display: "flex", justifyContent: "center" }} aria-hidden="true">
              <div className="vl-card" style={{ width: "100%", maxWidth: 420, overflow: "hidden", boxShadow: "inset 0 0 0 1px var(--ln), var(--shadow)" }}>
                <div style={{ height: 220, background: "var(--grad)", position: "relative" }}>
                  <span className="vl-sticker" style={{ position: "absolute", left: 18, top: 18, transform: "rotate(-4deg)" }}>MATCH FOUND</span>
                </div>
                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <div style={{ height: 22, width: "70%", borderRadius: 11, background: "var(--sf2)" }} />
                    <div style={{ height: 12, width: "45%", borderRadius: 6, background: "var(--sf2)", marginTop: 10 }} />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{ width: 52, height: 52, borderRadius: 26, background: "var(--sf2)" }} />
                    ))}
                  </div>
                  <span className="vl-store vl-store-g" style={{ height: 52, justifyContent: "center", fontSize: 15 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z" /></svg>
                    Where to watch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="vl-sec">
          <div className="vl-wrap" style={{ textAlign: "center" }}>
            <p className="vl-kick">Works with</p>
            <h2 className="vl-h2">Anything on <span className="vl-gt">any screen.</span></h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", margin: "40px auto 0", maxWidth: 860 }}>
              {WORKS_WITH.map((w) => <span key={w} className="vl-chip">{w}</span>)}
            </div>
            <p className="vl-muted" style={{ fontSize: 15, margin: "24px 0 0" }}>Movies, web series, TV episodes and creator reels — in any language.</p>
          </div>
        </section>

        <section id="pricing" className="vl-sec vl-alt">
          <div className="vl-wrap vl-split" style={{ gap: 56 }}>
            <div style={{ flex: "1 1 380px", minWidth: 0 }}>
              <p className="vl-kick">Pricing</p>
              <h2 className="vl-h2">Pay once. <span className="vl-gt">Scan 50 times.</span></h2>
              <p className="vl-lead">No subscription and no renewals. Buy a pack when you need it — your scans never expire.</p>
            </div>
            <div style={{ flex: "1 1 420px", display: "flex", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: 460, borderRadius: 32, overflow: "hidden", boxShadow: "var(--shadow)" }}>
                <div style={{ background: "var(--grad)", padding: 32, color: "#fff", position: "relative" }}>
                  <span className="vl-sticker" style={{ position: "absolute", right: 24, top: 28, transform: "rotate(4deg)" }}>≈ ₹10 / SCAN</span>
                  <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".14em" }}>ONE-TIME PACK</div>
                  <div className="vl-dsp" style={{ fontWeight: 800, fontSize: 96, lineHeight: 1, marginTop: 10 }}>50</div>
                  <div className="vl-dsp" style={{ fontWeight: 700, fontSize: 26 }}>scans</div>
                </div>
                <div style={{ background: "var(--bg)", padding: "28px 32px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                    <span className="vl-muted" style={{ fontWeight: 700 }}>Price</span>
                    <span className="vl-dsp" style={{ fontWeight: 800, fontSize: 40 }}>₹499</span>
                  </div>
                  <div className="vl-check"><Check size={20} />Never expires</div>
                  <div className="vl-check"><Check size={20} />Scan refunded if anything fails on our side</div>
                  <div className="vl-check"><Check size={20} />Paid through Google Play or the App Store</div>
                  <a href="#download" className="vl-store vl-store-g" style={{ justifyContent: "center", marginTop: 10 }}>Get the app</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="vl-sec">
          <div className="vl-wrap">
            <p className="vl-kick">Privacy</p>
            <h2 className="vl-h2">Your screen <span className="vl-gt">stays yours.</span></h2>
            <div className="vl-grid3">
              {PRIVACY.map((p) => (
                <div key={p.title} className="vl-card" style={{ padding: 28, display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>{p.icon}</svg>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{p.title}</div>
                    <p className="vl-muted" style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.55 }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="vl-sec vl-alt">
          <div className="vl-wrap" style={{ maxWidth: 860 }}>
            <p className="vl-kick" style={{ textAlign: "center" }}>FAQ</p>
            <h2 className="vl-h2" style={{ textAlign: "center" }}>Good <span className="vl-gt">questions.</span></h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 44 }}>
              {FAQ.map((f, i) => (
                <details key={f.q} className="vl-card vl-qa" open={i === 0}>
                  <summary>
                    {f.q}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="vl-sec">
          <div className="vl-wrap">
            <div className="vl-cta">
              <div aria-hidden="true" style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", background: "rgba(255,255,255,.12)", right: -90, top: -120 }} />
              <h2 className="vl-dsp" style={{ fontWeight: 800, fontSize: "clamp(36px,5.4vw,68px)", lineHeight: 1, margin: 0, position: "relative" }}>
                Never wonder
                <br />
                “what’s that?” again.
              </h2>
              <p style={{ fontSize: 18, opacity: 0.9, margin: "18px auto 0", maxWidth: 520, position: "relative" }}>
                Get Videofy on your phone and scan your first clip tonight.
              </p>
              <div style={{ marginTop: 34, position: "relative" }}>
                <StoreButtons variant="onGradient" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="vl-wrap vl-foot">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="vl-dsp" style={{ fontWeight: 800, fontSize: 18, color: "var(--ink)" }}>videofy</span>
          <span>© {new Date().getFullYear()} Videofy</span>
        </div>
        <nav aria-label="Footer">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/delete-account">Delete account</Link>
          <a href="mailto:support@videofy.co.in">support@videofy.co.in</a>
        </nav>
      </footer>
      <p className="vl-muted" style={{ margin: 0, padding: "0 24px 40px", textAlign: "center", fontSize: 12 }}>
        Movie and TV data from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </div>
  );
}
