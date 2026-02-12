// components/auth/forgotPassword.tsx
import { Form, Link, useActionData, useNavigation } from "react-router";
import { useState, useEffect } from "react";
import s from "./forgotPassword.module.css";

export default function ForgotPasswordComponent() {
  const actionData = useActionData<any>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cx = (...classes: (string | false | undefined)[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <div className={s.forgotPassword}>
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

        {/* Headline + Recovery Steps */}
        <div className={cx(s.heroContent, s.heroMiddle)}>
          <div
            className={cx(s.accentBar, mounted && s.fade, mounted && s.d2)}
          />

          <h1 className={cx(s.headline, mounted && s.rise, mounted && s.d3)}>
            Forgot your
            <br />
            password?
            <br />
            <span className={s.headlineAccent}>Don't worry</span>, we've got
            you.
          </h1>

          <p
            className={cx(
              s.heroDescription,
              mounted && s.rise,
              mounted && s.d4,
            )}
          >
            Password resets are quick and secure. Enter your email and we'll
            send instructions to get you back on track.
          </p>

          <div className={cx(s.stepsList, mounted && s.rise, mounted && s.d5)}>
            {[
              {
                number: "1",
                title: "Enter your email",
                desc: "Provide your registered email",
                active: true,
              },
              {
                number: "2",
                title: "Check your inbox",
                desc: "We'll send reset instructions",
                active: false,
              },
              {
                number: "3",
                title: "Create new password",
                desc: "Set up your new password",
                active: false,
              },
            ].map((step, i) => (
              <div
                key={i}
                className={cx(s.step, step.active && s.active)}
              >
                <div className={s.stepNumber}>{step.number}</div>
                <div className={s.stepContent}>
                  <div className={s.stepTitle}>{step.title}</div>
                  <div className={s.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className={s.heroContent}>
          <div className={cx(s.statsRow, mounted && s.rise, mounted && s.d7)}>
            {[
              { value: "24/7", label: "Support" },
              { value: "2,847", label: "Cars" },
              { value: "98%", label: "Success" },
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
            <h2 className={s.formHeading}>Reset your password</h2>
            <p className={s.formSubheading}>
              Enter your email and we'll send you reset instructions
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

          {/* Success alert */}
          {actionData?.success && (
            <div className={cx(s.alertSuccess, s.scale)}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--success)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 12 15 16 10" />
              </svg>
              <div className={s.alertSuccessText}>
                Reset instructions sent! Check your email for a link to reset
                your password. If you don't see it, check your spam folder.
              </div>
            </div>
          )}

          {/* Form */}
          <Form method="post">
            {/* Email */}
            <div
              className={cx(s.fieldGroup, mounted && s.rise, mounted && s.d3)}
            >
              <label className={s.fieldLabel}>Email address</label>
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
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  className={s.input}
                />
              </div>
            </div>

            {/* Submit */}
            <div className={cx(mounted && s.rise, mounted && s.d4)}>
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
                    Sending instructions…
                  </span>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </div>
          </Form>

          {/* Back to login link */}
          <div className={cx(s.backLink, mounted && s.fade, mounted && s.d5)}>
            <Link to="/auth/login" className={s.backLinkAnchor}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to login
            </Link>
          </div>

          {/* Trust badge */}
          <div className={cx(s.trustBadge, mounted && s.fade, mounted && s.d6)}>
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
