import { useState, useEffect } from "react";

// Hoisst booking confirmation / thank-you (React).
// Layout uses Tailwind utility classes; the Hoisst brand tokens (fonts, colors,
// success seal, gradients, breakpoints) live in the scoped style block below, so
// the component renders identically in any environment without a tailwind.config.

const LOGO = "data:image/png;base64,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";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700;800;900&display=swap";

const SCOPED_CSS = `:root{
  --navy:#0c3060;
  --navy-deep:#091f42;
  --navy-soft:#163d72;
  --mint:#0ccca8;
  --mint-bright:#1ee0bb;
  --mint-dark:#0a9d80;
  --blue:#2563eb;
  --blue-bright:#3b82f6;
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
    radial-gradient(ellipse 70% 60% at 50% 35%, rgba(12,204,168,0.18) 0%, transparent 65%),
    linear-gradient(180deg, var(--paper) 0%, var(--paper-warm) 100%);
  color:var(--ink);
  padding:72px 22px 64px;
  position:relative;
  overflow:hidden;
  text-align:center;
}
.hsx .hero::before{
  content:"";position:absolute;inset:0;
  background:
    repeating-linear-gradient(90deg, transparent 0, transparent 119px, rgba(12,48,96,0.022) 120px),
    repeating-linear-gradient(0deg, transparent 0, transparent 119px, rgba(12,48,96,0.022) 120px);
  pointer-events:none;z-index:1;
}
.hsx .hero-inner{position:relative;z-index:2;max-width:780px;margin:0 auto}
.hsx .seal{
  width:128px;height:128px;
  border-radius:50%;
  background:var(--mint);
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 30px;
  border:4px solid #fff;
  box-shadow:
    0 0 0 5px var(--mint),
    0 0 0 10px rgba(12,204,168,0.20),
    0 18px 38px rgba(10,157,128,0.30);
  animation:sealPulse 2.6s ease-in-out infinite;
}
.hsx .seal svg{width:60px;height:60px;color:#fff;stroke:#fff;stroke-width:3.5;fill:none;stroke-linecap:round;stroke-linejoin:round}
.hsx .seal svg path{
  stroke-dasharray:60;
  stroke-dashoffset:60;
  animation:sealCheck 0.9s ease-out 0.3s forwards;
}
@keyframes sealCheck{to{stroke-dashoffset:0}}
@keyframes sealPulse{
  0%,100%{box-shadow:0 0 0 5px var(--mint), 0 0 0 10px rgba(12,204,168,0.20), 0 18px 38px rgba(10,157,128,0.28)}
  50%   {box-shadow:0 0 0 5px var(--mint), 0 0 0 14px rgba(12,204,168,0.32), 0 22px 44px rgba(10,157,128,0.40)}
}
.hsx .hero-eyebrow{
  display:inline-block;
  font-family:var(--mono);
  font-size:11px;letter-spacing:0.20em;
  text-transform:uppercase;
  color:var(--mint-dark);font-weight:700;
  margin-bottom:20px;
  padding:8px 14px;
  background:rgba(12,204,168,0.12);
  border:1px solid rgba(12,204,168,0.45);
  border-radius:40px;
}
.hsx .hero-h1{
  font-family:var(--display);
  font-weight:400;
  text-transform:uppercase;
  line-height:0.94;
  letter-spacing:-0.005em;
  color:var(--navy);
  font-size:74px;
  margin-bottom:18px;
}
.hsx .hero-h1 .serif{
  font-family:var(--serif);font-style:italic;
  text-transform:none;color:var(--mint-dark);
  font-weight:400;letter-spacing:-0.015em;
}
.hsx .hero-h1 .mint{color:var(--mint-dark)}
.hsx .hero-sub{
  font-family:var(--body);
  font-size:19px;line-height:1.5;
  color:rgba(10,10,10,0.78);
  margin:0 auto 28px;
  max-width:620px;
}
.hsx .hero-sub strong{color:var(--navy);font-weight:700}
.hsx .hero-sub .user-name{color:var(--mint-dark);font-weight:700}
.hsx .booking-card{
  background:#fff;
  border:1px solid var(--line);
  border-left:4px solid var(--mint);
  border-radius:12px;
  padding:22px 28px;
  margin:0 auto;
  max-width:560px;
  display:grid;
  grid-template-columns:48px 1fr;
  gap:18px;
  align-items:center;
  text-align:left;
  box-shadow:0 8px 20px rgba(12,48,96,0.06);
}
.hsx .booking-card-icon{
  width:48px;height:48px;
  background:rgba(12,204,168,0.14);
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  color:var(--mint-dark);
}
.hsx .booking-card-icon svg{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.hsx .booking-card-tag{
  font-family:var(--mono);
  font-size:10px;letter-spacing:0.18em;
  text-transform:uppercase;
  color:var(--mint-dark);
  font-weight:700;
  margin-bottom:3px;
}
.hsx .booking-card-day{
  font-family:var(--body);
  font-weight:700;font-size:18px;
  color:var(--navy);
  letter-spacing:-0.01em;
  line-height:1.25;
}
.hsx .booking-card-time{
  font-family:var(--mono);
  font-size:12.5px;
  color:rgba(10,10,10,0.60);
  margin-top:2px;
  letter-spacing:0.01em;
}
.hsx .booking-card.no-time .booking-card-day{font-size:15px;color:var(--ink);font-weight:600}
.hsx .foot{
  background:var(--navy-deep);
  color:rgba(255,255,255,0.65);
  padding:48px 22px 36px;
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
@media(max-width:900px){.hsx .hero{padding:56px 20px 48px}.hsx .hero-h1{font-size:54px}}
@media(max-width:540px){.hsx .hero{padding:44px 18px 36px}.hsx .seal{width:96px;height:96px;margin-bottom:22px}.hsx .seal svg{width:44px;height:44px}.hsx .hero-eyebrow{font-size:9.5px;padding:7px 12px;margin-bottom:14px}.hsx .hero-h1{font-size:38px;line-height:0.96;margin-bottom:14px}.hsx .hero-sub{font-size:15.5px;margin-bottom:22px}.hsx .booking-card{padding:18px 20px;grid-template-columns:38px 1fr;gap:14px}.hsx .booking-card-icon{width:38px;height:38px}.hsx .booking-card-icon svg{width:20px;height:20px}.hsx .booking-card-day{font-size:16px}.hsx .booking-card-time{font-size:11.5px}.hsx .nav-back{font-size:9.5px}.hsx .nav-logo img{height:26px}}
@media(prefers-reduced-motion:reduce){.hsx *,.hsx *::before,.hsx *::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}
.hsx{display:flex;flex-direction:column;min-height:100vh}
.hsx .hero{display:flex;flex-direction:column;justify-content:center;flex:1 0 auto}
.hsx .hero-note{margin:22px auto 0;font-family:var(--body);font-size:13.5px;line-height:1.55;color:rgba(10,10,10,0.55);max-width:520px}
.hsx .hero-note a{color:var(--mint-dark);font-weight:600;text-decoration:none;border-bottom:1px solid rgba(10,157,128,0.4)}
.hsx .hero-note a:hover{color:var(--navy);border-bottom-color:var(--navy)}`;

export default function HoisstThankYou() {
  const [greeting, setGreeting] = useState("");
  const [email, setEmail] = useState("your inbox");
  const [hasTime, setHasTime] = useState(false);
  const [bookingTag, setBookingTag] = useState("◆ Booking Confirmed");
  const [bookingDay, setBookingDay] = useState("Check your inbox for the date and time");
  const [bookingTime, setBookingTime] = useState("");

  useEffect(() => {
    const id = "hoisst-fonts";
    if (!document.getElementById(id)) {
      const l = document.createElement("link");
      l.id = id; l.rel = "stylesheet"; l.href = FONT_HREF;
      document.head.appendChild(l);
    }
  }, []);
  
  useEffect(() => {
  if (window.fbq) {
    window.fbq("track", "Lead");
  }
}, []);

  // TidyCal redirects with ?name=&email=&starts_at= after a booking. Render those
  // so the confirmation feels personal and shows the slot without opening email.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clean = (s, max) => (s || "").trim().slice(0, max || 120);

    const name = clean(params.get("name"), 60);
    const mail = clean(params.get("email"), 120);
    if (name) setGreeting(name.split(/\s+/)[0] + ", ");
    if (mail) setEmail(mail);

    const tParam =
      params.get("starts_at") || params.get("start_at") ||
      params.get("time") || params.get("start") || "";
    if (tParam) {
      let d = null;
      try { d = new Date(tParam); } catch (e) {}
      if (d && !isNaN(d.getTime())) {
        const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
        const month = d.toLocaleDateString("en-US", { month: "long" });
        const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        let tz = "";
        try {
          const parts = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(d);
          const tzPart = parts.find((p) => p.type === "timeZoneName");
          tz = tzPart ? tzPart.value : (Intl.DateTimeFormat().resolvedOptions().timeZone || "");
        } catch (e) { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; }
        setBookingTag("◆ Your Call Is Booked");
        setBookingDay(dayName + ", " + month + " " + d.getDate() + ", " + d.getFullYear());
        setBookingTime(time + (tz ? "  ·  " + tz : ""));
        setHasTime(true);
      }
    }
  }, []);

  return (
    <div className="hsx">
      <style>{SCOPED_CSS}</style>

      {/* NAV */}
      <header className="nav">
        <div className="nav-logo">
          <a href="https://hoisst.in/"><img src={LOGO} alt="Hoisst" /></a>
        </div>
        <a href="https://hoisst.in/" className="nav-back">Back To Home</a>
      </header>

      {/* HERO (confirmation) */}
      <section className="hero">
        <div className="hero-inner">
          <div className="seal" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13l4 4 10-10" />
            </svg>
          </div>

          <div className="hero-eyebrow">◆ Step 1 Of Your 60-Day Build · Complete</div>

          <h1 className="hero-h1">
            <span className="user-greeting">{greeting}</span>You’re On <span className="serif">the calendar.</span>
          </h1>

          <p className="hero-sub">
            A confirmation is on its way to <strong><span className="user-name">{email}</span></strong>.
            We’ll be in touch with everything you need before we speak.
          </p>

          <div className={"booking-card" + (hasTime ? "" : " no-time")}>
            <div className="booking-card-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 9h18" />
                <path d="M8 3v4M16 3v4" />
              </svg>
            </div>
            <div>
              <div className="booking-card-tag">{bookingTag}</div>
              <div className="booking-card-day">{bookingDay}</div>
              {bookingTime && <div className="booking-card-time">{bookingTime}</div>}
            </div>
          </div>

          <div className="hero-note">
            Need to reschedule? Email{" "}
            <a href="mailto:hello@hoisst.in?subject=Reschedule%20My%20Call">hello@hoisst.in</a>{" "}
            and we’ll sort a new time.
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
