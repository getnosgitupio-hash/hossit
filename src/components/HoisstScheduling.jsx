import { useState, useEffect, useMemo } from "react";
import LOGO from "../images/log.png";

// Hoisst Scope Call scheduler (React).
// Layout uses Tailwind utility classes; the Hoisst brand tokens (fonts, colors,
// gradients, the dot markers) live in a scoped style block below so the
// component renders identically in any environment without depending on a
// tailwind.config. Drop it anywhere.
//
// LAYOUT: the live DaySchedule calendar is FIRST (top); the landing-page / hero
// content (headline, sub, "What To Bring") sits BELOW it.
//
// SCHEDULING: this embeds DaySchedule's official INLINE widget — the
// <dayschedule-widget url='…'> custom element + the CDN script below. A raw
// <iframe src> is blocked by DaySchedule (X-Frame-Options), which is why the
// old version had to open a new tab; the inline widget is the supported way to
// render the calendar directly in the page.  Docs: https://dayschedule.com/widget
//
// Replace SCHEDULER_URL with your live DaySchedule scheduling link.

// ============================================================================
// PASTE YOUR EXISTING LOGO BASE64 BELOW (copy the full LOGO line from your
// current file, unchanged). It is left as a placeholder here ONLY so this
// large data URI is not accidentally corrupted in transit.
// ============================================================================


const SCHEDULER_URL = "https://hoisst.dayschedule.com/discoverycall";
const WIDGET_SRC =
  "https://cdn.jsdelivr.net/npm/dayschedule-widget@latest/dist/dayschedule-widget.min.js";
// Accent colours passed to the DaySchedule widget. The dark theme itself comes
// from your DaySchedule account theme settings, not from here.
const WIDGET_BASE_OPTIONS = {
  color: { primary: "#0ccca8", secondary: "#0c3060" },
};
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700;800;900&display=swap";

function getLeadHandoff() {
  if (typeof window === "undefined") {
    return { name: "", email: "", phone: "" };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    name: (params.get("name") || "").trim().slice(0, 80),
    email: (params.get("email") || "").trim().slice(0, 120),
    phone: (params.get("phone") || params.get("mobile") || "")
      .trim()
      .slice(0, 40),
  };
}

function setQuestionAliases(target, aliases, value) {
  if (!value) return;
  aliases.forEach((key) => {
    target[key] = value;
  });
}

function getWidgetOptions({ name, email, phone }) {
  const questions = {};

  setQuestionAliases(
    questions,
    ["name", "full_name", "fullName", "invitee_name", "inviteeName"],
    name
  );
  setQuestionAliases(
    questions,
    ["email", "email_address", "emailAddress", "invitee_email", "inviteeEmail"],
    email
  );
  setQuestionAliases(
    questions,
    ["phone", "mobile", "mobile_number", "mobileNumber", "phone_number"],
    phone
  );

  return JSON.stringify({
    ...WIDGET_BASE_OPTIONS,
    questions,
  });
}

const SCOPED_CSS = `:root{
  --navy:#0c3060;
  --navy-deep:#091f42;
  --navy-soft:#163d72;
  --mint:#0ccca8;
  --mint-bright:#1ee0bb;
  --mint-dark:#0a9d80;
  --blue:#2563eb;
  --blue-bright:#3b82f6;
  --blue-dark:#1d4ed8;
  --paper:#fafaf2;
  --paper-warm:#f4f1e6;
  --paper-deep:#ebe7d8;
  --ink:#0a0a0a;
  --line:rgba(12,48,96,0.12);
  --line-soft:rgba(12,48,96,0.06);
  --muted:rgba(10,10,10,0.60);
  --display:'Anton',Impact,sans-serif;
  --serif:'Instrument Serif',Georgia,serif;
  --body:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  --mono:'JetBrains Mono',monospace;
}
.hsx *{box-sizing:border-box;margin:0;padding:0}
.hsx{
  font-family:var(--body);
  font-size:16px;line-height:1.55;
  color:var(--ink);
  background:var(--paper);
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}
.hsx img{max-width:100%;display:block}
.hsx .welcome{
  background:var(--mint-dark);color:#fff;
  padding:10px 18px;text-align:center;
  font-family:var(--mono);
  font-size:11px;letter-spacing:0.14em;
  text-transform:uppercase;font-weight:500;
  border-bottom:1.5px solid var(--mint);
  display:none;
}
.hsx .welcome.show{display:block}
.hsx .welcome .check{
  display:inline-block;width:14px;height:14px;
  margin-right:8px;vertical-align:-2px;
  background:#fff;border-radius:50%;
  color:var(--mint-dark);font-weight:900;
  font-size:9px;line-height:14px;
  text-transform:none;
}
.hsx .welcome b{font-weight:700;text-transform:none;letter-spacing:0;color:#fff}
.hsx .welcome .dismiss{
  display:inline-block;margin-left:12px;
  color:rgba(255,255,255,0.65);cursor:pointer;font-weight:700;
}
.hsx .welcome .dismiss:hover{color:#fff}
.hsx .nav{
  background:var(--navy);
  padding:14px 22px;
  display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid rgba(255,255,255,0.04);
}
.hsx .nav-logo img{height:32px;width:auto}
.hsx .nav-back{
  font-family:var(--mono);
  font-size:10px;letter-spacing:0.14em;
  text-transform:uppercase;
  color:rgba(255,255,255,0.55);
  font-weight:500;
  text-decoration:none;
  display:inline-flex;align-items:center;gap:6px;
  transition:color .15s ease;
}
.hsx .nav-back:hover{color:var(--mint)}
.hsx .nav-back::before{content:"←";font-size:13px}
.hsx .hero{
  background:
    radial-gradient(ellipse 60% 50% at 50% 20%, rgba(12,204,168,0.12) 0%, transparent 60%),
    linear-gradient(180deg, var(--paper) 0%, var(--paper-warm) 100%);
  color:var(--ink);
  padding:42px 22px 64px;
  position:relative;
  overflow:hidden;
}
.hsx .hero::before{
  content:"";position:absolute;inset:0;
  background:
    repeating-linear-gradient(90deg, transparent 0, transparent 119px, rgba(12,48,96,0.022) 120px),
    repeating-linear-gradient(0deg, transparent 0, transparent 119px, rgba(12,48,96,0.022) 120px);
  pointer-events:none;z-index:1;
}
.hsx .hero-inner{
  position:relative;z-index:2;
  max-width:1120px;margin:0 auto;
  display:flex;
  flex-direction:column;
  gap:52px;
  align-items:center;
}

/* ---- BOOKING (first / top) ---- */
.hsx .hero-cal{position:relative;width:100%;max-width:1080px;text-align:center}
.hsx .cal-frame-tag{
  display:inline-block;
  font-family:var(--mono);
  font-size:10px;letter-spacing:0.18em;
  text-transform:uppercase;
  color:var(--mint-dark);font-weight:700;
  margin-bottom:12px;
  padding:5px 10px;
  background:rgba(12,204,168,0.10);
  border:1px solid rgba(12,204,168,0.40);
  border-radius:40px;
}
.hsx .cal-head{margin-bottom:20px}
.hsx .cal-head-title{
  font-family:var(--display);
  text-transform:uppercase;
  letter-spacing:-0.005em;
  color:var(--navy);
  font-size:40px;line-height:1.0;
  margin-bottom:8px;
}
.hsx .cal-head-sub{
  font-family:var(--body);
  font-size:15px;line-height:1.5;
  color:rgba(10,10,10,0.66);
  max-width:480px;margin:0 auto;
}
.hsx .cal-wrap{
  border-radius:14px;  
  overflow:hidden;
  position:relative;
  min-height:560px;
}
.hsx .cal-wrap dayschedule-widget{display:block;width:100%;min-height:560px}
.hsx .cal-loading{
  position:absolute;inset:0;z-index:1;
  display:grid;place-items:center;
  font-family:var(--mono);
  font-size:11px;letter-spacing:0.18em;text-transform:uppercase;
  color:rgba(12,48,96,0.55);font-weight:600;
  pointer-events:none;
}
.hsx .cal-fallback{
  text-align:center;
  margin-top:16px;
  font-family:var(--body);
  font-size:13px;
  color:rgba(10,10,10,0.62);
}
.hsx .cal-fallback a{color:var(--mint-dark);font-weight:600;text-decoration:none;border-bottom:1px solid rgba(10,157,128,0.4)}
.hsx .cal-fallback a:hover{color:var(--navy);border-bottom-color:var(--navy)}

/* ---- LANDING-PAGE / HERO CONTENT (below) ---- */
.hsx .hero-content{
  width:100%;max-width:620px;
  display:flex;flex-direction:column;align-items:center;
  text-align:center;
  gap:32px;
  padding-top:8px;
  border-top:1px solid var(--line-soft);
}
.hsx .hero-intro{display:flex;flex-direction:column;align-items:center}
.hsx .hero-eyebrow{
  display:inline-block;
  font-family:var(--mono);
  font-size:11px;letter-spacing:0.20em;
  text-transform:uppercase;
  color:var(--mint-dark);font-weight:700;
  margin:30px 0 20px;
  padding:8px 14px;
  background:rgba(12,204,168,0.12);
  border:1px solid rgba(12,204,168,0.45);
  border-radius:40px;
}
.hsx .hero-h1{
  font-family:var(--display);
  font-weight:400;
  text-transform:uppercase;
  line-height:0.92;
  letter-spacing:-0.005em;
  color:var(--navy);
  font-size:56px;
  margin-bottom:16px;
}
.hsx .hero-h1 .serif{
  font-family:var(--serif);font-style:italic;
  text-transform:none;color:var(--mint-dark);
  font-weight:400;letter-spacing:-0.015em;
}
.hsx .hero-h1 .mint{color:var(--mint-dark)}
.hsx .hero-sub{
  font-family:var(--body);
  font-size:17px;line-height:1.5;
  color:rgba(10,10,10,0.78);
  margin-bottom:24px;
  max-width:520px;
}
.hsx .hero-sub strong{color:var(--mint-dark);font-weight:700}
.hsx .hero-stamps{
  display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
  gap:8px 22px;
  font-family:var(--mono);
  font-size:10.5px;letter-spacing:0.14em;
  text-transform:uppercase;
  color:rgba(10,10,10,0.55);
  font-weight:500;
}
.hsx .hero-stamps span{display:inline-flex;align-items:center;gap:7px}
.hsx .hero-stamps span::before{
  content:"";width:7px;height:7px;
  background:var(--mint);border-radius:50%;
}
.hsx .hero-prep{
  width:100%;max-width:520px;
  background:#fff;
  border:1px solid var(--line);
  border-left:3px solid var(--mint);
  border-radius:8px;
  padding:18px 20px;
  text-align:left;
}
.hsx .hero-prep-title{
  font-family:var(--mono);
  font-size:10px;letter-spacing:0.18em;
  text-transform:uppercase;
  color:var(--mint-dark);font-weight:700;
  margin-bottom:10px;
}
.hsx .hero-prep ul{list-style:none;display:flex;flex-direction:column;gap:8px}
.hsx .hero-prep li{
  position:relative;
  padding-left:18px;
  font-size:13.5px;line-height:1.45;
  color:rgba(10,10,10,0.78);
}
.hsx .hero-prep li::before{
  content:"";
  position:absolute;left:0;top:7px;
  width:7px;height:7px;
  background:var(--mint);border-radius:50%;
}
.hsx .hero-prep li strong{color:var(--navy);font-weight:700}
.hsx .foot{
  background:var(--navy-deep);
  color:rgba(255,255,255,0.65);
  padding:42px 22px 32px;
  text-align:center;
}
.hsx .foot-logo{margin-bottom:14px}
.hsx .foot-logo img{height:26px;width:auto;margin:0 auto}
.hsx .foot-tag{
  font-family:var(--serif);font-style:italic;
  font-size:14px;color:rgba(255,255,255,0.55);
  margin-bottom:18px;
}
.hsx .foot-links{
  font-family:var(--mono);
  font-size:10px;letter-spacing:0.14em;
  color:rgba(255,255,255,0.45);
  text-transform:uppercase;line-height:1.9;
}
.hsx .foot-links a{color:rgba(255,255,255,0.65);text-decoration:none;margin:0 8px}
.hsx .foot-links a:hover{color:var(--mint)}
@media(max-width:980px){.hsx .hero{padding:34px 18px 52px}.hsx .hero-inner{gap:40px}.hsx .cal-head-title{font-size:34px}.hsx .hero-h1{font-size:48px}.hsx .hero-sub{font-size:16.5px}}
@media(max-width:560px){
  .hsx .welcome{padding:9px 14px;font-size:10px;line-height:1.55;letter-spacing:0.12em}
  .hsx .welcome .check{margin-right:7px}
  .hsx .welcome .dismiss{margin-left:8px}
  .hsx .nav{padding:12px 18px}
  .hsx .nav-logo img{height:32px}
  .hsx .nav-back{font-size:9px;letter-spacing:0.12em}
  .hsx .hero{padding:24px 0 38px;overflow:hidden}
  .hsx .hero-inner{gap:30px}
  .hsx .hero-cal{max-width:none}
  .hsx .cal-frame-tag{font-size:9.5px;padding:5px 10px;margin-bottom:16px}
  .hsx .cal-head{padding:0 20px;margin-bottom:18px}
  .hsx .cal-head-title{font-size:30px;line-height:0.98;margin-bottom:12px}
  .hsx .cal-head-sub{font-size:15px;line-height:1.45;max-width:360px}
  .hsx .cal-wrap{
    min-height:0;
    border-left:0;
    border-right:0;
    border-radius:0;
    box-shadow:none;
  }
  .hsx .cal-wrap dayschedule-widget{min-height:calc(100vh - 170px)}
  .hsx .cal-fallback{padding:0 20px;font-size:12px;line-height:1.45}
  .hsx .hero-content{padding:8px 20px 0;gap:26px}
  .hsx .hero-eyebrow{font-size:9.5px;padding:7px 12px;margin:18px 0 14px}
  .hsx .hero-h1{font-size:38px;line-height:0.95;margin-bottom:12px}
  .hsx .hero-sub{font-size:15px;margin-bottom:18px}
  .hsx .hero-stamps{font-size:9.5px;gap:6px 16px}
  .hsx .hero-prep{padding:14px 16px}
  .hsx .hero-prep li{font-size:13px}
}
@media(prefers-reduced-motion:reduce){.hsx *,.hsx *::before,.hsx *::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}`;

export default function HoisstScheduling() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("back");
  const [welcomeEmail, setWelcomeEmail] = useState("");
  const [widgetReady, setWidgetReady] = useState(false);
  const leadHandoff = useMemo(() => getLeadHandoff(), []);
  const widgetOptions = useMemo(
    () => getWidgetOptions(leadHandoff),
    [leadHandoff]
  );

  // Build the booking URL once, on first render, with any lead details handed
  // over from the landing-page redirect appended for prefill.
  const [bookingUrl] = useState(() => {
    const { name, email, phone } = getLeadHandoff();
    const qs = new URLSearchParams();
    if (name) qs.set("name", name);
    if (email) qs.set("email", email);
    if (phone) {
      qs.set("phone", phone);
      qs.set("mobile", phone);
    }
    return qs.toString()
      ? SCHEDULER_URL + (SCHEDULER_URL.includes("?") ? "&" : "?") + qs.toString()
      : SCHEDULER_URL;
  });

  // Load brand fonts once.
  useEffect(() => {
    const id = "hoisst-fonts";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id; l.rel = "stylesheet"; l.href = FONT_HREF;
      document.head.appendChild(l);
    }
  }, []);

  // Show the welcome bar from the LP redirect params.
  useEffect(() => {
    const { name, email, phone } = getLeadHandoff();
    if (name || email || phone) {
      if (name) setWelcomeName(name);
      if (email || phone) {
        setWelcomeEmail("(" + [email, phone].filter(Boolean).join(" · ") + ")");
      }
      setShowWelcome(true);
    }
  }, []);

  // Load the DaySchedule inline-widget script once. The <dayschedule-widget>
  // custom element below upgrades itself as soon as the script defines it.
  useEffect(() => {
    const id = "dayschedule-widget-js";
    const existing = document.getElementById(id);
    if (existing) {
      setWidgetReady(true);
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = WIDGET_SRC;
    s.defer = true;
    s.onload = () => setWidgetReady(true);
    document.body.appendChild(s);
  }, []);

  return (
    <div className="hsx">
      <style>{SCOPED_CSS}</style>

      {/* WELCOME (from LP redirect) */}
      <div className={"welcome" + (showWelcome ? " show" : "")}>
        <span className="check">✓</span>
        <span>
          Welcome <b>{welcomeName}</b>. Almost there <b>{welcomeEmail}</b>. Pick a time below.
        </span>
        <span className="dismiss" title="Dismiss" onClick={() => setShowWelcome(false)}>×</span>
      </div>

      {/* NAV */}
      <header className="nav">
        <div className="nav-logo">
         
            <img src={LOGO} alt="Hoisst" />
        
        </div>
        <a href="https://hoisst.in/" className="nav-back">Back To Home</a>
      </header>

      {/* HERO — calendar first, content below */}
      <section className="hero">
        <div className="hero-inner">

          {/* BOOKING — first / top */}
          <div className="hero-cal">
            <div className="cal-frame-tag">◆ Pick A Time</div>
            <div className="cal-head">
              <h2 className="cal-head-title">Grab Your 30-Minute Slot</h2>
              <p className="cal-head-sub">
                Choose a time that works — you will get a Google Meet link by email instantly.
              </p>
            </div>
            <div className="cal-wrap">
              {!widgetReady && <div className="cal-loading">◆ Loading the calendar…</div>}
              <dayschedule-widget url={bookingUrl} options={widgetOptions}></dayschedule-widget>
            </div>
            <div className="cal-fallback">
              Prefer email? Reach us at{" "}
              <a href="mailto:hello@hoisst.in?subject=Scope%20Call%20Booking">hello@hoisst.in</a>{" "}
              and we will book you in by hand.
            </div>
          </div>

          {/* LANDING-PAGE / HERO CONTENT — below the calendar */}
          <div className="hero-content">
            <div className="hero-intro">
              <div className="hero-eyebrow">◆ Step 1 Of Your 60-Day Build</div>
              <h1 className="hero-h1">
                Book Your <span className="mint">Free</span> <span className="serif">Scope Call.</span>
              </h1>
              <p className="hero-sub">
                30 minutes on Zoom. We calculate your <strong>specific Workaround Tax</strong> in
                writing, identify the 3 workflows custom software would replace first, and give you a
                go or no-go verdict.
              </p>
              <div className="hero-stamps">
                <span>30 Minutes</span>
                <span>Zero Pitch</span>
                <span>Verdict In Writing</span>
              </div>
            </div>

            <div className="hero-prep">
              <div className="hero-prep-title">◆ What To Bring</div>
              <ul>
                <li><strong>A one-paragraph workflow description.</strong> Your core daily process.</li>
                <li><strong>A screenshot of your SaaS stack.</strong> The tools your team currently runs.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="foot-logo"><img src={LOGO} alt="Hoisst" /></div>
        <div className="foot-tag">Together we sell, we rise.</div>
        <div className="foot-links">hello@hoisst.in</div>
      </footer>
    </div>
  );
}
