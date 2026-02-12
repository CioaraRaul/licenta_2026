// components/auth/login.tsx
import { Form, Link, useActionData, useNavigation } from "react-router";
import { useState, useEffect } from "react";
import s from "./login.module.css";
import { resendVerificationEmail } from "~/api/auth.api";

export default function LoginComponent() {
  const actionData = useActionData<any>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cx = (...classes: (string | false | undefined)[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <div className={s.login}>
      {/* ========== Left Hero Panel ========== */}
      <div className={s.hero}>
        <div className={s.grain} />

        {/* Logo */}
        <div className={s.heroContent}>
          <div className={cx(s.logoWrap, mounted && s.slide, mounted && s.d1)}>
            <div className={s.logoIcon}>
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
            <span className={s.logoText}>AutoVault</span>
          </div>
        </div>

        {/* Headline + Features */}
        <div className={cx(s.heroContent, s.heroMiddle)}>
          <div
            className={cx(s.accentBar, mounted && s.fade, mounted && s.d2)}
          />

          <h1 className={cx(s.headline, mounted && s.rise, mounted && s.d3)}>
            Find the car
            <br />
            you've always
            <br />
            <span className={s.headlineAccent}>dreamed</span> of.
          </h1>

          <p
            className={cx(
              s.heroDescription,
              mounted && s.rise,
              mounted && s.d4,
            )}
          >
            A curated marketplace connecting discerning buyers with verified,
            premium vehicles.
          </p>

          <div
            className={cx(s.featureList, mounted && s.rise, mounted && s.d5)}
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
              <div key={i} className={s.feature}>
                <div className={s.featureIcon} style={{ background: f.bg }}>
                  {f.icon}
                </div>
                <div>
                  <div className={s.featureTitle}>{f.title}</div>
                  <div className={s.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className={s.heroContent}>
          <div className={cx(s.statsRow, mounted && s.rise, mounted && s.d7)}>
            {[
              { value: "15,200+", label: "Active listings" },
              { value: "8,400", label: "Vehicles sold" },
              { value: "4.9/5", label: "Buyer rating" },
            ].map((stat, i) => (
              <div key={i} className={s.statItem}>
                <div className={s.statValue}>{stat.value}</div>
                <div className={s.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== Right Form Panel ========== */}
      <div className={s.formPanel}>
        <div className={s.formInner}>
          {/* Mobile logo */}
          <div className={cx(s.mobileLogo, mounted && s.fade, mounted && s.d1)}>
            <div className={s.logoIconSmall}>
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
            <span className={s.logoTextSmall}>AutoVault</span>
          </div>

          {/* Heading */}
          <div
            className={cx(s.headingWrap, mounted && s.rise, mounted && s.d2)}
          >
            <h2 className={s.formHeading}>Welcome back</h2>
            <p className={s.formSubheading}>
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error alert */}
          {actionData?.error && (
            <div className={cx(s.alertError, s.scale)}>
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
              <span className={s.alertErrorText}>{actionData.error}</span>
            </div>
          )}

          {/* Deactivated warning */}
          {actionData?.accountDeactivated && (
            <div className={cx(s.alertWarning, s.scale)}>
              <p className={s.alertWarningText}>{actionData.message}</p>
              <a href="/auth/reactivate" className={s.alertWarningLink}>
                Reactivate account →
              </a>
            </div>
          )}

          {actionData?.emailNotVerified && (
            <div className={cx(s.alertError, s.scale)}>
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
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 6L2 7" />
              </svg>
              <div>
                <span className={s.alertErrorText}>{actionData.message}</span>
                <button
                  type="button"
                  className={s.resendLink}
                  onClick={async () => {
                    try {
                      await resendVerificationEmail(actionData.email);
                      alert("Verification email sent! Check your inbox.");
                    } catch {
                      alert("Failed to resend. Please try again.");
                    }
                  }}
                >
                  Resend verification email
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <Form method="post">
            {/* Email */}
            <div
              className={cx(s.fieldGroup, mounted && s.rise, mounted && s.d3)}
            >
              <label className={s.fieldLabel}>Email or Username</label>
              <div className={s.inputWrap}>
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
                  placeholder="name@company.com | username"
                  required
                  className={s.input}
                />
              </div>
            </div>

            {/* Password */}
            <div
              className={cx(s.fieldGroup, mounted && s.rise, mounted && s.d4)}
            >
              <label className={s.fieldLabel}>Password</label>
              <div className={s.inputWrap}>
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
                  className={s.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={s.togglePw}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              className={cx(s.rememberRow, mounted && s.rise, mounted && s.d5)}
            >
              <label className={s.rememberLabel}>
                <input type="checkbox" className={s.rememberCheckbox} />
                <span className={s.rememberText}>Remember me</span>
              </label>
              <Link to="/auth/forgot-password" className={s.forgotLink}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <div className={cx(mounted && s.rise, mounted && s.d6)}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={s.btnPrimary}
              >
                {isSubmitting ? (
                  <span className={s.btnContent}>
                    <svg
                      className={s.spinner}
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
          <div className={cx(s.divider, mounted && s.fade, mounted && s.d7)}>
            <div className={s.dividerLine} />
            <span className={s.dividerText}>or continue with</span>
            <div className={s.dividerLine} />
          </div>

          {/* OAuth */}
          <div className={cx(s.oauthGrid, mounted && s.rise, mounted && s.d8)}>
            <button
              type="button"
              onClick={() =>
                (window.location.href = "http://localhost:3000/auth/google")
              }
              className={s.btnOauth}
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
              className={s.btnOauth}
            >
              <svg width="17" height="17" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Sign up */}
          <div className={cx(s.signUpWrap, mounted && s.fade, mounted && s.d9)}>
            <p className={s.signUpText}>
              Don't have an account?{" "}
              <Link to="/auth/register" className={s.signUpLink}>
                Create Account
              </Link>
            </p>
          </div>

          {/* Trust badge */}
          <div className={cx(s.trustBadge, mounted && s.fade, mounted && s.d9)}>
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
            <span className={s.trustText}>
              Protected with 256-bit SSL encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
