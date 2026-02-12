// components/auth/resetPassword.tsx
import { Form, Link, useNavigation } from "react-router";
import { useState, useEffect, useMemo } from "react";
import s from "./resetPassword.module.css";
import type { ResetPasswordProps } from "~/interface/auth.interface";

export default function ResetPasswordComponent({
  resetToken,
  loaderError,
  actionError,
  isSuccess,
}: ResetPasswordProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const cx = (...classes: (string | false | undefined)[]) =>
    classes.filter(Boolean).join(" ");

  // Password strength
  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: "", class: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return { level: 1, label: "Weak", class: "Weak" };
    if (score <= 3) return { level: 2, label: "Medium", class: "Medium" };
    return { level: 3, label: "Strong", class: "Strong" };
  }, [password]);

  const getBarClass = (index: number) => {
    if (index >= passwordStrength.level) return s.strengthBar;
    if (passwordStrength.class === "Weak") return s.strengthBarWeak;
    if (passwordStrength.class === "Medium") return s.strengthBarMedium;
    return s.strengthBarStrong;
  };

  const getTextClass = () => {
    if (passwordStrength.class === "Weak") return s.strengthTextWeak;
    if (passwordStrength.class === "Medium") return s.strengthTextMedium;
    return s.strengthTextStrong;
  };

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const canSubmit = password.length >= 6 && passwordsMatch && !isSubmitting;

  if (isSuccess) {
    return (
      <div className={s.resetPage}>
        <div className={cx(s.card, s.scale)}>
          <a href="/" className={cx(s.logoWrap, s.fade, s.d1)}>
            <div className={s.logoIcon}>
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
            <span className={s.logoText}>AutoVault</span>
          </a>
          <div className={cx(s.rise, s.d2)}>
            <div className={s.iconCircleSuccess}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--success)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" className={s.successCheck} />
              </svg>
            </div>
          </div>
          <div className={cx(s.headingWrap, s.rise, s.d3)}>
            <h1 className={s.heading}>Password reset!</h1>
            <p className={s.subheading}>
              Your password has been changed successfully. You can now sign in.
            </p>
          </div>
          <a
            href="/auth/login"
            className={s.btnPrimary}
            style={{
              textDecoration: "none",
              textAlign: "center",
              display: "block",
            }}
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // ===== EXPIRED / INVALID LINK =====
  if (loaderError || !resetToken) {
    return (
      <div className={s.resetPage}>
        <div className={cx(s.card, mounted && s.scale)}>
          <Link
            to="/"
            className={cx(s.logoWrap, mounted && s.fade, mounted && s.d1)}
          >
            <div className={s.logoIcon}>
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
            <span className={s.logoText}>AutoVault</span>
          </Link>
          <div className={cx(mounted && s.rise, mounted && s.d2)}>
            <div className={s.iconCircleError}>
              <svg
                width="28"
                height="28"
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
            </div>
          </div>
          <div
            className={cx(s.headingWrap, mounted && s.rise, mounted && s.d3)}
          >
            <h1 className={s.heading}>Link expired</h1>
            <p className={s.subheading}>
              {loaderError || "This link is invalid. Please request a new one."}
            </p>
          </div>
          <a
            href="/auth/forgot-password"
            className={s.btnPrimary}
            style={{
              textDecoration: "none",
              textAlign: "center",
              display: "block",
            }}
          >
            Request New Link
          </a>
          <a href="/auth/login" className={s.backLink}>
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
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={s.resetPage}>
      <div className={cx(s.card, mounted && s.scale)}>
        <a
          href="/"
          className={cx(s.logoWrap, mounted && s.fade, mounted && s.d1)}
        >
          <div className={s.logoIcon}>
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
          <span className={s.logoText}>AutoVault</span>
        </a>

        <div className={cx(mounted && s.rise, mounted && s.d2)}>
          <div className={s.iconCircleEmber}>
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ember)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        </div>

        <div className={cx(s.headingWrap, mounted && s.rise, mounted && s.d3)}>
          <h1 className={s.heading}>Set new password</h1>
          <p className={s.subheading}>
            Choose a strong password to secure your account
          </p>
        </div>

        {actionError && (
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
            <span className={s.alertErrorText}>{actionError}</span>
          </div>
        )}

        <Form method="post">
          <input type="hidden" name="resetToken" value={resetToken} />

          {/* New Password */}
          <div className={cx(s.fieldGroup, mounted && s.rise, mounted && s.d4)}>
            <label className={s.fieldLabel}>New Password</label>
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
                name="newPassword"
                placeholder="Min. 6 characters"
                required
                minLength={6}
                className={s.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={s.togglePw}
                aria-label={showPassword ? "Hide" : "Show"}
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
            {password && (
              <div className={s.strengthWrap}>
                <div className={s.strengthBars}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={getBarClass(i)} />
                  ))}
                </div>
                <span className={getTextClass()}>
                  {passwordStrength.label} password
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className={cx(s.fieldGroup, mounted && s.rise, mounted && s.d5)}>
            <label className={s.fieldLabel}>Confirm Password</label>
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                required
                className={s.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={s.togglePw}
                aria-label={showConfirm ? "Hide" : "Show"}
              >
                {showConfirm ? (
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
            {passwordsMatch && (
              <div className={s.matchSuccess}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Passwords match
              </div>
            )}
            {passwordsMismatch && (
              <div className={s.matchError}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Passwords don't match
              </div>
            )}
          </div>

          {/* Submit */}
          <div className={cx(mounted && s.rise, mounted && s.d6)}>
            <button
              type="submit"
              disabled={!canSubmit}
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
                  Resetting password…
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </Form>

        <Link
          to="/auth/login"
          className={cx(s.backLink, mounted && s.fade, mounted && s.d7)}
        >
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
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Sign In
        </Link>

        <div className={cx(s.trustBadge, mounted && s.fade, mounted && s.d7)}>
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
  );
}
