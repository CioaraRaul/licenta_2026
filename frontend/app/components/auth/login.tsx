// components/auth/login.tsx
import { Form, useActionData, useNavigation } from "react-router";
import { useState, useEffect } from "react";

export default function LoginComponent() {
  const actionData = useActionData<any>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .av-login {
          --carbon: #0C0C0E;
          --onyx: #141417;
          --graphite: #1C1C21;
          --steel: #26262D;
          --silver: #8E8E9A;
          --chrome: #BBBBC6;
          --pearl: #E8E8ED;
          --white: #F5F5F7;
          --ember: #E63946;
          --ember-soft: rgba(230, 57, 70, 0.12);
          --ember-glow: rgba(230, 57, 70, 0.35);

          font-family: 'DM Sans', -apple-system, sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
          background: var(--carbon);
          color: var(--white);
          overflow: hidden;
        }

        @media (min-width: 1024px) {
          .av-login { grid-template-columns: 1.15fr 1fr; }
        }

        /* ====== ANIMATIONS ====== */
        @keyframes av-rise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes av-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes av-scale {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes av-slide-right {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes av-counter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes av-grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          30% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 2%); }
          70% { transform: translate(3%, 1%); }
          90% { transform: translate(2%, -1%); }
        }

        .av-rise { animation: av-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .av-fade { animation: av-fade 0.6s ease both; }
        .av-scale { animation: av-scale 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .av-slide { animation: av-slide-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .av-d1 { animation-delay: 0.05s; }
        .av-d2 { animation-delay: 0.12s; }
        .av-d3 { animation-delay: 0.2s; }
        .av-d4 { animation-delay: 0.28s; }
        .av-d5 { animation-delay: 0.36s; }
        .av-d6 { animation-delay: 0.44s; }
        .av-d7 { animation-delay: 0.52s; }
        .av-d8 { animation-delay: 0.6s; }
        .av-d9 { animation-delay: 0.68s; }

        /* ====== LEFT HERO ====== */
        .av-hero {
          display: none;
          position: relative;
          overflow: hidden;
          padding: 44px;
        }

        @media (min-width: 1024px) {
          .av-hero { display: flex; flex-direction: column; justify-content: space-between; }
        }

        /* Film grain overlay */
        .av-grain {
          position: absolute; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.035'/%3E%3C/svg%3E");
          animation: av-grain 4s steps(6) infinite;
          pointer-events: none; z-index: 5;
        }

        /* Diagonal accent strip */
        .av-hero::before {
          content: '';
          position: absolute;
          top: -20%; right: -5%;
          width: 45%; height: 140%;
          background: linear-gradient(165deg, var(--ember-soft) 0%, transparent 60%);
          transform: skewX(-8deg);
          z-index: 1;
        }

        /* Subtle grid texture */
        .av-hero::after {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
          z-index: 2;
        }

        .av-hero-content { position: relative; z-index: 10; }

        /* ====== FORM PANEL ====== */
        .av-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 1024px) {
          .av-form-panel {
            padding: 40px 64px;
            border-left: 1px solid rgba(255,255,255,0.04);
          }
        }

        .av-form-inner { width: 100%; max-width: 400px; }

        /* ====== INPUT STYLES ====== */
        .av-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--onyx);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .av-input-wrap:focus-within {
          border-color: var(--ember);
          box-shadow: 0 0 0 3px var(--ember-soft);
        }

        .av-input-wrap svg {
          flex-shrink: 0;
          margin-left: 14px;
          color: var(--silver);
          transition: color 0.3s;
        }

        .av-input-wrap:focus-within svg { color: var(--ember); }

        .av-input {
          flex: 1;
          padding: 14px 14px;
          background: none;
          border: none;
          outline: none;
          color: var(--white);
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .av-input::placeholder { color: var(--silver); opacity: 0.5; }

        .av-toggle-pw {
          background: none;
          border: none;
          padding: 0 14px;
          cursor: pointer;
          color: var(--silver);
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .av-toggle-pw:hover { color: var(--chrome); }

        /* ====== BUTTON STYLES ====== */
        .av-btn-primary {
          width: 100%;
          padding: 15px 24px;
          background: var(--ember);
          border: none;
          border-radius: 10px;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .av-btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .av-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px var(--ember-glow);
        }
        .av-btn-primary:hover::after { opacity: 1; }
        .av-btn-primary:active { transform: translateY(0); }

        .av-btn-primary:disabled {
          background: var(--steel);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .av-btn-oauth {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px 16px;
          background: var(--onyx);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          color: var(--chrome);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s;
        }

        .av-btn-oauth:hover {
          background: var(--graphite);
          border-color: rgba(255,255,255,0.1);
          color: var(--white);
          transform: translateY(-1px);
        }

        /* ====== FEATURE CARDS ====== */
        .av-feature {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
          backdrop-filter: blur(8px);
          transition: all 0.3s;
        }

        .av-feature:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }

        .av-feature-icon {
          width: 38px; height: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ====== STAT ITEMS ====== */
        .av-stat-item { position: relative; }
        .av-stat-item + .av-stat-item::before {
          content: '';
          position: absolute;
          left: -20px;
          top: 8px; bottom: 8px;
          width: 1px;
          background: rgba(255,255,255,0.08);
        }

        /* ====== SPINNER ====== */
        @keyframes av-spin { to { transform: rotate(360deg); } }
        .av-spinner { animation: av-spin 0.8s linear infinite; }
      `}</style>

      <div className="av-login">
        {/* ========== LEFT HERO PANEL ========== */}
        <div className="av-hero">
          <div className="av-grain" />

          {/* TOP: Logo */}
          <div className="av-hero-content">
            <div
              className={`${mounted ? "av-slide av-d1" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: "var(--ember)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 19,
                  fontWeight: 700,
                  color: "var(--white)",
                  letterSpacing: "-0.01em",
                }}
              >
                AutoVault
              </span>
            </div>
          </div>

          {/* MIDDLE: Hero Content */}
          <div className="av-hero-content" style={{ marginTop: -40 }}>
            <div
              className={`${mounted ? "av-fade av-d2" : ""}`}
              style={{
                width: 48,
                height: 3,
                background: "var(--ember)",
                borderRadius: 2,
                marginBottom: 28,
              }}
            />

            <h1
              className={`${mounted ? "av-rise av-d3" : ""}`}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(40px, 3.8vw, 58px)",
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                color: "var(--white)",
                marginBottom: 20,
              }}
            >
              Find the car
              <br />
              you've always
              <br />
              <span style={{ color: "var(--ember)", fontStyle: "italic" }}>
                dreamed
              </span>{" "}
              of.
            </h1>

            <p
              className={`${mounted ? "av-rise av-d4" : ""}`}
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: "var(--silver)",
                maxWidth: 400,
                marginBottom: 36,
              }}
            >
              A curated marketplace connecting discerning buyers with verified,
              premium vehicles.
            </p>

            <div
              className={`${mounted ? "av-rise av-d5" : ""}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                maxWidth: 380,
              }}
            >
              {[
                {
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--ember)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  ),
                  title: "Verified Sellers",
                  desc: "Every dealer background-checked",
                  bg: "var(--ember-soft)",
                },
                {
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  ),
                  title: "Secure Payments",
                  desc: "Escrow-protected transactions",
                  bg: "rgba(59,130,246,0.1)",
                },
                {
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                    </svg>
                  ),
                  title: "150-Point Inspection",
                  desc: "Certified vehicle condition reports",
                  bg: "rgba(16,185,129,0.1)",
                },
              ].map((f, i) => (
                <div key={i} className="av-feature">
                  <div className="av-feature-icon" style={{ background: f.bg }}>
                    {f.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--pearl)",
                        marginBottom: 2,
                      }}
                    >
                      {f.title}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--silver)" }}>
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM: Stats */}
          <div className="av-hero-content">
            <div
              className={`${mounted ? "av-rise av-d7" : ""}`}
              style={{
                display: "flex",
                gap: 40,
                paddingTop: 28,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {[
                { value: "15,200+", label: "Active listings" },
                { value: "8,400", label: "Vehicles sold" },
                { value: "4.9/5", label: "Buyer rating" },
              ].map((s, i) => (
                <div key={i} className="av-stat-item" style={{}}>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 26,
                      fontWeight: 700,
                      color: "var(--white)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--silver)",
                      marginTop: 6,
                      fontWeight: 500,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== RIGHT FORM PANEL ========== */}
        <div className="av-form-panel">
          <div className="av-form-inner">
            {/* Mobile-only logo */}
            <div
              className={`${mounted ? "av-fade av-d1" : ""} av-mobile-logo`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 44,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "var(--ember)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--white)",
                }}
              >
                AutoVault
              </span>
            </div>
            <style>{`@media(min-width:1024px){.av-mobile-logo{display:none!important;}}`}</style>

            {/* Heading */}
            <div
              className={`${mounted ? "av-rise av-d2" : ""}`}
              style={{ marginBottom: 32 }}
            >
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: "var(--white)",
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                }}
              >
                Welcome back
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--silver)",
                  lineHeight: 1.5,
                }}
              >
                Enter your credentials to access your account
              </p>
            </div>

            {/* Error */}
            {actionData?.error && (
              <div
                className="av-scale"
                style={{
                  marginBottom: 20,
                  padding: "12px 14px",
                  background: "var(--ember-soft)",
                  border: "1px solid rgba(230,57,70,0.2)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--ember)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span
                  style={{ fontSize: 13.5, color: "#F87171", fontWeight: 500 }}
                >
                  {actionData.error}
                </span>
              </div>
            )}

            {actionData?.accountDeactivated && (
              <div
                className="av-scale"
                style={{
                  marginBottom: 20,
                  padding: "12px 14px",
                  background: "rgba(251,191,36,0.08)",
                  border: "1px solid rgba(251,191,36,0.2)",
                  borderRadius: 10,
                }}
              >
                <p
                  style={{
                    fontSize: 13.5,
                    color: "#FBBF24",
                    fontWeight: 500,
                    margin: "0 0 6px",
                  }}
                >
                  {actionData.message}
                </p>
                <a
                  href="/auth/reactivate"
                  style={{
                    fontSize: 13,
                    color: "var(--ember)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Reactivate account →
                </a>
              </div>
            )}

            {/* Form */}
            <Form method="post">
              {/* Email */}
              <div
                className={`${mounted ? "av-rise av-d3" : ""}`}
                style={{ marginBottom: 18 }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--chrome)",
                    marginBottom: 7,
                  }}
                >
                  Email or Username
                </label>
                <div className="av-input-wrap">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-10 6L2 7" />
                  </svg>
                  <input
                    type="text"
                    name="emailOrUsername"
                    placeholder="name@company.com"
                    required
                    className="av-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div
                className={`${mounted ? "av-rise av-d4" : ""}`}
                style={{ marginBottom: 18 }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--chrome)",
                    marginBottom: 7,
                  }}
                >
                  Password
                </label>
                <div className="av-input-wrap">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    required
                    className="av-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="av-toggle-pw"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div
                className={`${mounted ? "av-rise av-d5" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 26,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{
                      accentColor: "var(--ember)",
                      width: 15,
                      height: 15,
                      cursor: "pointer",
                    }}
                  />
                  <span style={{ fontSize: 13, color: "var(--silver)" }}>
                    Remember me
                  </span>
                </label>
                <a
                  href="/auth/forgot-password"
                  style={{
                    fontSize: 13,
                    color: "var(--ember)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <div className={`${mounted ? "av-rise av-d6" : ""}`}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="av-btn-primary"
                >
                  {isSubmitting ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <svg
                        className="av-spinner"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          opacity="0.25"
                        />
                        <path
                          d="M12 2a10 10 0 019.95 9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Signing in…
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </Form>

            {/* Divider */}
            <div
              className={`${mounted ? "av-fade av-d7" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                margin: "26px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                }}
              />
              <span
                style={{
                  fontSize: 11.5,
                  color: "var(--silver)",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                or continue with
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                }}
              />
            </div>

            {/* OAuth */}
            <div
              className={`${mounted ? "av-rise av-d8" : ""}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={() =>
                  (window.location.href = "http://localhost:3000/auth/google")
                }
                className="av-btn-oauth"
              >
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() =>
                  (window.location.href = "http://localhost:3000/auth/facebook")
                }
                className="av-btn-oauth"
              >
                <svg width="17" height="17" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Sign up */}
            <div
              className={`${mounted ? "av-fade av-d9" : ""}`}
              style={{
                textAlign: "center",
                marginTop: 30,
              }}
            >
              <p style={{ fontSize: 14, color: "var(--silver)" }}>
                Don't have an account?{" "}
                <a
                  href="/auth/register"
                  style={{
                    color: "var(--white)",
                    fontWeight: 600,
                    textDecoration: "none",
                    borderBottom: "1px solid var(--ember)",
                    paddingBottom: 1,
                  }}
                >
                  Create Account
                </a>
              </p>
            </div>

            {/* Trust */}
            <div
              className={`${mounted ? "av-fade av-d9" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--silver)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--silver)",
                  fontWeight: 400,
                }}
              >
                Protected with 256-bit SSL encryption
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
