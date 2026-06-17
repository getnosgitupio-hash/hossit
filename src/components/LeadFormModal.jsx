import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const TYPES = [
  {
    id: "fnb",
    title: "Multi-Outlet F&B",
    sub: "Restaurants, cafes, cloud kitchens",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M17 3c-1.5 0-3 1.5-3 4v5h3m0-9v18" />
      </svg>
    ),
  },
  {
    id: "retail",
    title: "Retail / Distribution",
    sub: "Multi-city stores, depots, dealers",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    id: "mfg",
    title: "Manufacturing / FMCG",
    sub: "Plants, SKUs, vendor supply",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 21V8l6 4V8l6 4V6l6 4v11H3z" />
      </svg>
    ),
  },
  {
    id: "services",
    title: "Services / EdTech",
    sub: "Agencies, institutes, SaaS ops",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4" />
      </svg>
    ),
  },
  {
    id: "other",
    title: "Something Else",
    sub: "Tell us on the call",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 1.8-2 3M12 17h.01" />
      </svg>
    ),
  },
];

const REVENUE = [
  "Under ₹2 Cr",
  "₹2 Cr to ₹5 Cr",
  "₹5 Cr to ₹15 Cr",
  "₹15 Cr to ₹50 Cr",
  "Above ₹50 Cr",
];

const PAINS = [
  "Too many SaaS tools that do not talk",
  "The Monday roll-up eats an ops salary",
  "Inventory or stock errors caught too late",
  "Outlet / multi-location data never syncs",
  "Reporting is manual and always behind",
  "Honestly, I am not sure yet",
];

// [name, dial code, flag]
const COUNTRIES = [
  ["India", "+91", "🇮🇳"],
  ["United States", "+1", "🇺🇸"],
  ["United Kingdom", "+44", "🇬🇧"],
  ["United Arab Emirates", "+971", "🇦🇪"],
  ["Singapore", "+65", "🇸🇬"],
  ["Australia", "+61", "🇦🇺"],
  ["Canada", "+1", "🇨🇦"],
  ["Germany", "+49", "🇩🇪"],
  ["France", "+33", "🇫🇷"],
  ["Saudi Arabia", "+966", "🇸🇦"],
  ["Malaysia", "+60", "🇲🇾"],
  ["Sri Lanka", "+94", "🇱🇰"],
  ["Bangladesh", "+880", "🇧🇩"],
  ["Nepal", "+977", "🇳🇵"],
  ["Indonesia", "+62", "🇮🇩"],
  ["Netherlands", "+31", "🇳🇱"],
  ["Japan", "+81", "🇯🇵"],
  ["New Zealand", "+64", "🇳🇿"],
];

// the wizard, one field per screen
const STEPS = [
  "type",
  "name",
  "company",
  "email",
  "phone",
  "revenue",
  "pain",
  "consent",
];

/* ------------------------------------------------------------------ */
/* Per-field validation                                                */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "aol.com",
  "mail.com",
  "yahoo.co.in",
  "rediffmail.com",
  "ymail.com",
  "protonmail.com",
  "gmx.com",
  "zoho.com",
  "fastmail.com",
  "inbox.com",
  "msn.com",
  "rocketmail.com",
  "att.net",
  "bellsouth.net",
  "comcast.net",
  "verizon.net",
  "me.com",
  "qq.com",
  "163.com",
];

function isWorkEmail(value) {
  const email = value.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return false;
  const domain = email.split("@").pop();
  return !FREE_EMAIL_DOMAINS.includes(domain);
}

function validate(key, f, type) {
  switch (key) {
    case "type":
      return type ? "" : "Pick the option that fits best.";
    case "name":
      return f.name.trim().length >= 2 ? "" : "Please enter your name.";
    case "company":
      return f.company.trim().length >= 1 ? "" : "Tell us your company name.";
    case "email":
      if (!f.email.trim()) return "We need an email to send the verdict.";
      if (!EMAIL_RE.test(f.email.trim())) return "That email looks off.";
      return isWorkEmail(f.email)
        ? ""
        : "Please use your work email, not a public provider.";
    case "phone": {
  const digits = f.phone.replace(/\D/g, "");

  if (!digits) {
    return "Please enter your mobile number.";
  }

  return digits.length === 10
    ? ""
    : "Mobile number must be exactly 10 digits.";
}
    case "revenue":
      return f.revenue ? "" : "Choose the closest band.";
    case "pain":
      return f.pain ? "" : "Pick the one that stings most.";
    case "consent":
      return f.consent ? "" : "Please tick the box so we can email you.";
    default:
      return "";
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function HoisstScopeModal({
  open = true,
  onClose = () => {},
  bookingUrl = "/hossit/schedule",
  endpoint = "https://getnos.io/hossit/index.php",
}) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [type, setType] = useState(null);
  const [f, setF] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    revenue: "",
    pain: "",
    consent: false,
  });

  const [cc, setCc] = useState(
    COUNTRIES.find((c) => c[1] === "+91") || COUNTRIES[0]
  );
  const [ccOpen, setCcOpen] = useState(false);
  const [ccSearch, setCcSearch] = useState("");

  const [showErr, setShowErr] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");

  const cardRef = useRef(null);
  const ccRef = useRef(null);

  const key = STEPS[idx];
  const set = useCallback((k, v) => setF((p) => ({ ...p, [k]: v })), []);

  const stepError = useMemo(() => validate(key, f, type), [key, f, type]);
  const firstName = f.name.trim().split(/\s+/)[0] || "there";

  const requestClose = useCallback(() => onClose(), [onClose]);

  /* ---- navigation ---- */
  const goNext = useCallback(() => {
    const e = validate(STEPS[idx], f, type);
    if (e) {
      setShowErr(true);
      return;
    }
    setShowErr(false);
    setIdx((i) => Math.min(i + 1, STEPS.length - 1));
  }, [idx, f, type]);

  const goBack = useCallback(() => {
    setShowErr(false);
    setIdx((i) => Math.max(i - 1, 0));
  }, []);

  // selecting a card / option auto-advances
  const pickType = (t) => {
    setType(t);
    setShowErr(false);
    setIdx((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const pickOption = (field, val) => {
    set(field, val);
    setShowErr(false);
    setIdx((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const submit = () => {
    const e = validate("consent", f, type);
    if (e) {
      setShowErr(true);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitErr("");

      const email = f.email.trim().toLowerCase();
      const submittedEmails = JSON.parse(
        localStorage.getItem("submittedEmails") || "[]"
      );

      if (submittedEmails.includes(email)) {
        setSubmitErr("This email has already been registered.");
        setSubmitting(false);
        return;
      }

      const rawEndpoint = endpoint?.trim();
      const hasFile = rawEndpoint && /\/[^/]+\.[a-zA-Z0-9]+$/.test(rawEndpoint);
      const targetEndpoint = rawEndpoint
        ? rawEndpoint.endsWith("/")
          ? rawEndpoint.replace(/\/+$/, "") + "/index.php"
          : hasFile
          ? rawEndpoint
          : rawEndpoint + "/index.php"
        : "https://getnos.io/hossit/index.php";

      const body = new FormData();

      const fullPhone = `${cc[1]} ${f.phone.trim()}`;

      body.append("name", f.name.trim());
      body.append("company", f.company.trim());
      body.append("email", f.email.trim());
      body.append("phone", fullPhone);
      body.append("revenue", f.revenue);
      body.append("pain", f.pain);
      body.append("type", type ? type.title : "");
      body.append("consent", "yes");

      submittedEmails.push(email);
      localStorage.setItem("submittedEmails", JSON.stringify(submittedEmails));

      if (navigator.sendBeacon) {
        navigator.sendBeacon(targetEndpoint, body);
      } else {
        fetch(targetEndpoint, {
          method: "POST",
          body,
          keepalive: true,
        }).catch((err) => {
          console.error("Lead submit failed:", err);
        });
      }

      const fallbackBookingUrl = "/hossit/schedule";
      const baseUrl =
        bookingUrl && !bookingUrl.includes("{{")
          ? bookingUrl
          : fallbackBookingUrl;

      // Carry the captured details to the scheduling page so DaySchedule
      // pre-fills its form (name / email / mobile) and the visitor never
      // retypes them. The scheduling page reads these params and feeds them
      // to the DaySchedule widget.
      const handoff = new URLSearchParams();
      if (f.name.trim()) handoff.set("name", f.name.trim());
      if (email) handoff.set("email", email);
      if (f.phone.trim()) handoff.set("phone", fullPhone);
      const nextUrl = handoff.toString()
        ? baseUrl + (baseUrl.includes("?") ? "&" : "?") + handoff.toString()
        : baseUrl;

      requestClose();
      window.location.assign(nextUrl);
    } catch (err) {
      console.error("ERROR:", err);
      setSubmitErr(err.message);
      setSubmitting(false);
    }
  };

  /* ---- Enter key advances text/email/phone steps ---- */
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goNext();
    }
  };

  /* ---- focus first control when the step changes ---- */
  useEffect(() => {
    if (!open || done) return;
    const t = setTimeout(() => {
      const el = cardRef.current?.querySelector(
        ".hl-step.is-shown [data-autofocus]"
      );
      el?.focus();
    }, 90);
    return () => clearTimeout(t);
  }, [idx, open, done]);

  /* ---- close country dropdown on outside click ---- */
  useEffect(() => {
    if (!ccOpen) return;
    const onDoc = (e) => {
      if (ccRef.current && !ccRef.current.contains(e.target)) setCcOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [ccOpen]);

  /* ---- Esc closes modal ---- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, requestClose]);

  const ccList = useMemo(() => {
    const q = ccSearch.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c[0].toLowerCase().includes(q) || c[1].includes(q)
    );
  }, [ccSearch]);

  // helper: per-step field wrapper class
  const fieldCls = (fieldKey) =>
    `hl-field${showErr && stepError && key === fieldKey ? " has-error" : ""}`;

  const showBack = !done && idx > 0;

  return (
    <div
      className={`hl-modal${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Book a free scope call"
      aria-hidden={!open}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="hl-backdrop" onClick={requestClose} />

      <div className="hl-card" ref={cardRef}>
        <button
          className="hl-close"
          type="button"
          aria-label="Close"
          onClick={requestClose}
        >
          &times;
        </button>

        <div className="hl-body">
          {/* top chrome: back + progress (hidden on the done screen) */}
          {!done && (
            <>
              <button
                type="button"
                className="hl-back"
                onClick={goBack}
                hidden={!showBack}
              >
                &larr; Back
              </button>

              <div className="hl-progress">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`hl-progress-seg${
                      i < idx ? " is-done" : i === idx ? " is-active" : ""
                    }`}
                  />
                ))}
              </div>
              <div className="hl-progress-label">
                Step {idx + 1} of {STEPS.length}
                {idx === 0 ? " · 30 seconds" : type ? ` · ${type.title}` : ""}
              </div>
            </>
          )}

          {/* STEP 1 — type */}
          <div className={`hl-step${key === "type" && !done ? " is-shown" : ""}`}>
            <div className="hl-eyebrow">The Next 30 Minutes</div>
            <h2 className="hl-title">
              Book Your <span className="ser">free</span> Scope Call.
            </h2>
            <p className="hl-sub">
              30 minutes on Zoom. We calculate your Workaround Tax in writing and
              give you a go or no-go verdict. No pitch, no pressure.
            </p>
            <p className="hl-step-q">What best describes your business?</p>
            <div className="hl-types">
              {TYPES.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  data-autofocus={i === 0 ? "" : undefined}
                  className={`hl-type${
                    type && type.id === t.id ? " is-sel" : ""
                  }${t.id === "other" ? " hl-type-full" : ""}`}
                  onClick={() => pickType(t)}
                >
                  <span className="hl-type-ic">{t.icon}</span>
                  <span className="hl-type-tx">
                    <b>{t.title}</b>
                    <span>{t.sub}</span>
                  </span>
                  <span className="hl-type-check">&#10003;</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2 — name */}
          <div className={`hl-step${key === "name" && !done ? " is-shown" : ""}`}>
            <div className="hl-eyebrow">Your Details</div>
            <p className="hl-step-q hl-step-q-lg">First, what is your name?</p>
            <div className={fieldCls("name")} data-field="name">
              <label htmlFor="hl-name">
                Your name <span className="req">*</span>
              </label>
              <input
                id="hl-name"
                data-autofocus=""
                type="text"
                placeholder="Full name"
                autoComplete="name"
                value={f.name}
                onChange={(e) => set("name", e.target.value)}
                onKeyDown={onKeyDown}
              />
              <span className="hl-msg">
                {showErr && key === "name" ? stepError : ""}
              </span>
            </div>
            <div className="hl-submit-wrap">
              <NextButton onClick={goNext} />
            </div>
          </div>

          {/* STEP 3 — company */}
          <div
            className={`hl-step${key === "company" && !done ? " is-shown" : ""}`}
          >
            <div className="hl-eyebrow">Your Details</div>
            <p className="hl-step-q hl-step-q-lg">
              What is your company called?
            </p>
            <div className={fieldCls("company")} data-field="company">
              <label htmlFor="hl-company">
                Company <span className="req">*</span>
              </label>
              <input
                id="hl-company"
                data-autofocus=""
                type="text"
                placeholder="Your business"
                autoComplete="organization"
                value={f.company}
                onChange={(e) => set("company", e.target.value)}
                onKeyDown={onKeyDown}
              />
              <span className="hl-msg">
                {showErr && key === "company" ? stepError : ""}
              </span>
            </div>
            <div className="hl-submit-wrap">
              <NextButton onClick={goNext} />
            </div>
          </div>

          {/* STEP 4 — email */}
          <div className={`hl-step${key === "email" && !done ? " is-shown" : ""}`}>
            <div className="hl-eyebrow">Where To Send It</div>
            <h2 className="hl-title">
              Where Do We <span className="ser">send</span> Your Verdict?
            </h2>
            <p className="hl-sub">
              Your honest go or no-go verdict, in writing, within 24 hours of the
              call.
            </p>
            <div className={fieldCls("email")} data-field="email">
              <label htmlFor="hl-email">
                Work email <span className="req">*</span>
              </label>
              <input
                id="hl-email"
                data-autofocus=""
                type="email"
                placeholder="you@company.in"
                autoComplete="email"
                value={f.email}
                onChange={(e) => set("email", e.target.value)}
                onKeyDown={onKeyDown}
              />
              <span className="hl-msg">
                {showErr && key === "email" ? stepError : ""}
              </span>
            </div>
            <div className="hl-submit-wrap">
              <NextButton onClick={goNext} />
            </div>
          </div>

          {/* STEP 5 — phone */}
          <div className={`hl-step${key === "phone" && !done ? " is-shown" : ""}`}>
            <div className="hl-eyebrow">Where To Send It</div>
            <p className="hl-step-q hl-step-q-lg">
              And a mobile number for the call?
            </p>
            <div className={fieldCls("phone")} data-field="phone">
              <label>
                Mobile number <span className="req">*</span>
              </label>
              <div className="hl-phone" ref={ccRef}>
                <button
                  type="button"
                  className="hl-cc-btn"
                  aria-label="Select country code"
                  onClick={() => setCcOpen((v) => !v)}
                >
                  <span className="hl-cc-flag">{cc[2]}</span>
                  <span className="hl-cc-code">{cc[1]}</span>
                  <span className="hl-cc-arrow">&#9662;</span>
                </button>
                <input
                  data-autofocus=""
                  type="tel"
                  maxLength={10}
                  placeholder="Phone number"
                  autoComplete="tel"
                  value={f.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  onKeyDown={onKeyDown}
                />
                <div className="hl-cc-dropdown" hidden={!ccOpen}>
                  <input
                    className="hl-cc-search"
                    type="text"
                    placeholder="Search country"
                    autoComplete="off"
                    value={ccSearch}
                    onChange={(e) => setCcSearch(e.target.value)}
                  />
                  <div className="hl-cc-list">
                    {ccList.length === 0 && (
                      <div className="hl-cc-empty">No match</div>
                    )}
                    {ccList.map((c) => (
                      <button
                        key={c[0]}
                        type="button"
                        className={`hl-cc-item${
                          c[0] === cc[0] ? " is-active" : ""
                        }`}
                        onClick={() => {
                          setCc(c);
                          setCcOpen(false);
                          setCcSearch("");
                        }}
                      >
                        <span className="hl-cc-item-flag">{c[2]}</span>
                        <span className="hl-cc-item-name">{c[0]}</span>
                        <span className="hl-cc-item-code">{c[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <span className="hl-msg">
                {showErr && key === "phone" ? stepError : ""}
              </span>
            </div>
            <div className="hl-submit-wrap">
              <NextButton onClick={goNext} />
            </div>
          </div>

          {/* STEP 6 — revenue */}
          <div
            className={`hl-step${key === "revenue" && !done ? " is-shown" : ""}`}
          >
            <div className="hl-eyebrow">A Bit Of Context</div>
            <p className="hl-step-q hl-step-q-lg">What is your annual revenue?</p>
            <div className={fieldCls("revenue")} data-field="revenue">
              <div className="hl-types hl-types-tight">
                {REVENUE.map((r, i) => (
                  <button
                    key={r}
                    type="button"
                    data-autofocus={i === 0 ? "" : undefined}
                    className={`hl-type hl-type-full hl-type-opt${
                      f.revenue === r ? " is-sel" : ""
                    }`}
                    onClick={() => pickOption("revenue", r)}
                  >
                    <span className="hl-type-tx">
                      <b>{r}</b>
                    </span>
                    <span className="hl-type-check">&#10003;</span>
                  </button>
                ))}
              </div>
              <span className="hl-msg" style={{ marginTop: "8px" }}>
                {showErr && key === "revenue" ? stepError : ""}
              </span>
            </div>
          </div>

          {/* STEP 7 — pain */}
          <div className={`hl-step${key === "pain" && !done ? " is-shown" : ""}`}>
            <div className="hl-eyebrow">A Bit Of Context</div>
            <p className="hl-step-q hl-step-q-lg">
              What is your biggest operations headache?
            </p>
            <div className={fieldCls("pain")} data-field="pain">
              <div className="hl-types hl-types-tight">
                {PAINS.map((p, i) => (
                  <button
                    key={p}
                    type="button"
                    data-autofocus={i === 0 ? "" : undefined}
                    className={`hl-type hl-type-full hl-type-opt${
                      f.pain === p ? " is-sel" : ""
                    }`}
                    onClick={() => pickOption("pain", p)}
                  >
                    <span className="hl-type-tx">
                      <b>{p}</b>
                    </span>
                    <span className="hl-type-check">&#10003;</span>
                  </button>
                ))}
              </div>
              <span className="hl-msg" style={{ marginTop: "8px" }}>
                {showErr && key === "pain" ? stepError : ""}
              </span>
            </div>
          </div>

          {/* STEP 8 — consent + submit */}
          <div
            className={`hl-step${key === "consent" && !done ? " is-shown" : ""}`}
          >
            <div className="hl-eyebrow">Last Step</div>
            <p className="hl-step-q hl-step-q-lg">
              One last thing before we lock it in.
            </p>
            <label
              className={`hl-consent${
                showErr && key === "consent" && stepError ? " has-error" : ""
              }`}
            >
              <input
                data-autofocus=""
                type="checkbox"
                checked={f.consent}
                onChange={(e) => set("consent", e.target.checked)}
              />
              <span>
                I agree to receive call-related emails from Hoisst. No spam. No
                sharing. <a href="#privacy">Privacy policy</a>.
              </span>
            </label>
            {showErr && key === "consent" && stepError && (
              <div className="hl-msg hl-msg-block">{stepError}</div>
            )}
            {submitErr && <div className="hl-error-summary">{submitErr}</div>}
            <div className="hl-submit-wrap" style={{ marginTop: "16px" }}>
              <button
                type="button"
                className="hl-cta"
                onClick={submit}
                disabled={submitting}
              >
                <span className="hl-cta-main">
                  {submitting
                    ? "Booking your slot..."
                    : "Book My Free Scope Call"}
                </span>
                <span className="hl-cta-sub">
                  30 minutes · No pitch · Verdict in writing
                </span>
              </button>
              <p className="hl-fineprint">
                No credit card. We turn down roughly 40% of scope calls, so a yes
                from us means it genuinely fits.
              </p>
            </div>
          </div>

          {/* DONE */}
          <div className={`hl-step${done ? " is-shown" : ""}`}>
            <div className="hl-done">
              <div className="hl-seal">
                <svg viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3>
                You're in, <span className="ser">{firstName}.</span>
              </h3>
              {type && (
                <div className="hl-recap">
                  Build type: <b>{type.title}</b>
                </div>
              )}
              <p>
                We will calculate your <strong>Workaround Tax</strong> and send a
                go or no-go verdict in writing within 24 hours. Watch{" "}
                <strong>{f.email || "your inbox"}</strong>.
              </p>
              <p style={{ marginBottom: "20px" }}>
                Bring a one-paragraph description of your core workflow and a
                screenshot of your current stack to the call.
              </p>
              <button
                type="button"
                className="hl-done-close"
                onClick={requestClose}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* small reusable Continue button with the arrow glyph */
function NextButton({ onClick }) {
  return (
    <button type="button" className="hl-next" onClick={onClick}>
      Continue
      <svg viewBox="0 0 24 24">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Styles — swap these tokens for your brand values if you already    */
/* ship hl-* CSS. Only .hl-next, .hl-step-q-lg, .hl-type-opt and the  */
/* .hl-step transition are new vs. the 2-step version.                */
/* ------------------------------------------------------------------ */

const css = `
.hl-modal{
  --bg:#f1f0e7; --bg2:#ffffff; --line:#e4e1d3; --ink:#0e2a4a;
  --mut:#5e6b78; --accent:#1ca089; --accent2:#15876f; --ok:#16a06a; --err:#d64545;
  --navy:#0e3a5c; --mint:#e3f3ea;
  --r:16px; --font:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  position:fixed; inset:0; z-index:9999; display:none;
  align-items:center; justify-content:center; padding:20px;
  font-family:var(--font); color:var(--ink);
}
.hl-modal.is-open{display:flex}
.hl-backdrop{position:absolute; inset:0; background:rgba(6,16,28,.74); backdrop-filter:blur(4px)}
.hl-card{
  position:relative; width:100%; max-width:560px; max-height:92vh; overflow:auto;
  background:var(--bg); border:1px solid var(--line); border-radius:var(--r);
  box-shadow:0 30px 80px rgba(0,0,0,.55); animation:hlCard .35s cubic-bezier(.2,.8,.2,1);
}
@keyframes hlCard{from{opacity:0; transform:translateY(14px) scale(.985)}to{opacity:1; transform:none}}
.hl-close{
  position:absolute; top:12px; right:14px; z-index:2; width:34px; height:34px;
  border:0; border-radius:50%; background:transparent; color:var(--mut);
  font-size:26px; line-height:1; cursor:pointer; transition:.2s;
}
.hl-close:hover{background:var(--bg2); color:var(--ink)}
.hl-body{padding:30px 30px 28px}

.hl-back{
  background:none; border:0; color:var(--mut); cursor:pointer; font-size:13px;
  padding:0 0 14px; transition:.2s;
}
.hl-back:hover{color:var(--ink)}

.hl-progress{display:flex; gap:6px; margin-bottom:8px}
.hl-progress-seg{flex:1; height:4px; border-radius:99px; background:var(--line); transition:.3s}
.hl-progress-seg.is-active{background:var(--accent)}
.hl-progress-seg.is-done{background:var(--accent2)}
.hl-progress-label{font-size:12px; color:var(--mut); letter-spacing:.02em; margin-bottom:20px}

.hl-eyebrow{font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--accent); margin-bottom:10px; font-weight:700}
.hl-eyebrow::before{content:"\u25C6"; font-size:8px; margin-right:7px; vertical-align:1px}
.hl-title{font-size:26px; line-height:1.15; font-weight:800; letter-spacing:.005em; text-transform:uppercase; margin:0 0 10px}
.ser{font-family:Georgia,"Times New Roman",serif; font-style:italic; font-weight:500; text-transform:none; color:var(--accent)}
.hl-sub{color:var(--mut); font-size:14px; line-height:1.55; margin:0 0 16px}
.hl-step-q{font-size:14px; font-weight:600; margin:18px 0 12px}
.hl-step-q-lg{font-size:22px; font-weight:700; line-height:1.25; margin:6px 0 18px}

/* step show / hide with a gentle slide */
.hl-step{display:none}
.hl-step.is-shown{display:block; animation:hlStep .34s cubic-bezier(.2,.8,.2,1)}
@keyframes hlStep{from{opacity:0; transform:translateX(14px)}to{opacity:1; transform:none}}

/* choice cards / option buttons */
.hl-types{display:grid; grid-template-columns:1fr 1fr; gap:10px}
.hl-types-tight{grid-template-columns:1fr; gap:8px}
.hl-type{
  display:flex; align-items:center; gap:12px; text-align:left; cursor:pointer;
  background:var(--bg2); border:1px solid var(--line); border-radius:12px;
  padding:13px 14px; color:var(--ink); transition:.18s;
}
.hl-type:hover{border-color:var(--accent2); transform:translateY(-1px)}
.hl-type.is-sel{border-color:var(--accent); background:var(--mint)}
.hl-type-full{grid-column:1 / -1}
.hl-type-opt{padding:14px 16px}
.hl-type-ic{flex:0 0 auto; width:34px; height:34px; display:grid; place-items:center;
  border-radius:9px; background:var(--navy); transition:.18s}
.hl-type-ic svg{width:20px; height:20px; fill:none; stroke:#cfe9e2; stroke-width:1.7;
  stroke-linecap:round; stroke-linejoin:round; transition:.18s}
.hl-type.is-sel .hl-type-ic{background:var(--accent)}
.hl-type.is-sel .hl-type-ic svg{stroke:#fff}
.hl-type-tx{display:flex; flex-direction:column; gap:2px; flex:1; min-width:0}
.hl-type-tx b{font-size:14px; font-weight:600}
.hl-type-tx span{font-size:12px; color:var(--mut)}
.hl-type-check{margin-left:auto; flex:0 0 auto; width:22px; height:22px; border-radius:50%;
  display:grid; place-items:center; background:var(--accent); color:#fff; font-size:12px;
  opacity:0; transform:scale(.5); transition:.18s}
.hl-type.is-sel .hl-type-check{opacity:1; transform:none}

/* fields */
.hl-field{display:flex; flex-direction:column; gap:6px; margin-bottom:4px}
.hl-field label{font-size:13px; font-weight:600; color:var(--ink)}
.req{color:var(--accent)}
.hl-field input,.hl-field select{
  background:var(--bg2); border:1px solid var(--line); border-radius:10px;
  padding:12px 13px; color:var(--ink); font-size:15px; font-family:inherit; outline:none; transition:.18s;
}
.hl-field input::placeholder{color:#94a0ab}
.hl-field input:focus,.hl-field select:focus{border-color:var(--accent); box-shadow:0 0 0 3px rgba(28,160,137,.16)}
.hl-field.has-error input,.hl-field.has-error select{border-color:var(--err)}
.hl-msg{min-height:16px; font-size:12px; color:var(--err)}
.hl-msg-block{margin-top:8px}

/* phone + country picker */
.hl-phone{position:relative; display:flex; gap:8px}
.hl-cc-btn{
  display:flex; align-items:center; gap:6px; background:var(--bg2);
  border:1px solid var(--line); border-radius:10px; padding:0 11px; color:var(--ink);
  cursor:pointer; font-size:14px; flex:0 0 auto;
}
.hl-cc-btn:hover{border-color:var(--accent2)}
.hl-cc-arrow{color:var(--mut); font-size:11px}
.hl-phone input[type=tel]{flex:1; width:100%}
.hl-cc-dropdown{
  position:absolute; top:calc(100% + 6px); left:0; width:280px; max-width:100%; z-index:5;
  background:var(--bg2); border:1px solid var(--line); border-radius:12px; padding:8px;
  box-shadow:0 18px 44px rgba(0,0,0,.5);
}
.hl-cc-search{width:100%; margin-bottom:6px}
.hl-cc-list{max-height:210px; overflow:auto; display:flex; flex-direction:column; gap:2px}
.hl-cc-item{display:flex; align-items:center; gap:10px; width:100%; text-align:left;
  background:none; border:0; border-radius:8px; padding:8px 9px; color:var(--ink); cursor:pointer; font-size:13px}
.hl-cc-item:hover{background:var(--bg)}
.hl-cc-item.is-active{background:var(--mint)}
.hl-cc-item-name{flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.hl-cc-item-code{color:var(--mut)}
.hl-cc-empty{padding:10px; color:var(--mut); font-size:13px; text-align:center}

/* consent */
.hl-consent{display:flex; align-items:flex-start; gap:10px; font-size:13px; color:var(--mut); line-height:1.5; cursor:pointer}
.hl-consent input{margin-top:2px; accent-color:var(--accent); width:16px; height:16px}
.hl-consent a{color:var(--accent)}
.hl-consent.has-error span{color:var(--err)}

/* buttons */
.hl-submit-wrap{margin-top:20px}
.hl-next{
  display:inline-flex; align-items:center; gap:8px; background:var(--accent); color:#fff;
  border:0; border-radius:11px; padding:13px 22px; font-size:15px; font-weight:700; cursor:pointer; transition:.18s;
}
.hl-next:hover{background:var(--accent2); transform:translateY(-1px)}
.hl-next svg{width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round}
.hl-cta{
  display:flex; flex-direction:column; align-items:center; gap:2px; width:100%;
  background:var(--accent); color:#fff; border:0; border-radius:13px; padding:15px; cursor:pointer; transition:.18s;
}
.hl-cta:hover:not(:disabled){background:var(--accent2); transform:translateY(-1px)}
.hl-cta:disabled{opacity:.65; cursor:default}
.hl-cta-main{font-size:16px; font-weight:700}
.hl-cta-sub{font-size:12px; opacity:.8}
.hl-fineprint{font-size:12px; color:var(--mut); line-height:1.5; margin:12px 0 0; text-align:center}
.hl-error-summary{background:rgba(255,107,107,.1); border:1px solid rgba(255,107,107,.4);
  color:var(--err); font-size:13px; border-radius:10px; padding:10px 12px; margin-top:14px}

/* done */
.hl-done{text-align:center; padding:10px 0}
.hl-seal{width:60px; height:60px; border-radius:50%; margin:0 auto 16px; display:grid; place-items:center;
  background:rgba(22,160,106,.13); border:1px solid rgba(22,160,106,.42); animation:hlSeal .4s .05s both cubic-bezier(.2,.9,.3,1.3)}
@keyframes hlSeal{from{transform:scale(.4); opacity:0}to{transform:none; opacity:1}}
.hl-seal svg{width:28px; height:28px; fill:none; stroke:var(--ok); stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round}
.hl-done h3{font-size:24px; margin:0 0 12px}
.hl-recap{display:inline-block; font-size:13px; color:var(--mut); background:var(--bg2);
  border:1px solid var(--line); border-radius:99px; padding:6px 14px; margin-bottom:14px}
.hl-recap b{color:var(--ink)}
.hl-done p{color:var(--mut); font-size:14px; line-height:1.6; margin:0 0 10px}
.hl-done strong{color:var(--ink)}
.hl-done-close{background:var(--bg2); border:1px solid var(--line); color:var(--ink);
  border-radius:11px; padding:11px 26px; font-size:14px; font-weight:600; cursor:pointer; transition:.18s}
.hl-done-close:hover{border-color:var(--accent2)}

@media(max-width:480px){
  .hl-body{padding:24px 20px 22px}
  .hl-types{grid-template-columns:1fr}
  .hl-type-full{grid-column:auto}
  .hl-title{font-size:23px}
  .hl-step-q-lg{font-size:20px}
}
`;
