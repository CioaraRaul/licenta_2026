import { Form, Link, useActionData, useNavigation } from "react-router";
import { useState, useEffect, useMemo } from "react";
import s from "./signup.module.css";
import { resendVerificationEmail } from "~/api/auth.api";

export default function SignUpComponent() {
  const actionData = useActionData<any>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  const cx = (...classes: (string | false | undefined)[]) =>
    classes.filter(Boolean).join(" ");

  // Password strength calculation
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

  // ===== SUCCESS — Check your email screen =====
  if (actionData?.message && !actionData?.error) {
    return (
      <div className={s.register}>
        {/* Empty hero panel for layout consistency */}
        <div className={s.hero}>
          <div className={s.grain} />
          <div className={s.heroContent}>
            <div className={cx(s.logoWrap, s.slide, s.d1)}>
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
          <div className={cx(s.heroContent, s.heroMiddle)}>
            <div className={cx(s.accentBar, s.fade, s.d2)} />
            <h1 className={cx(s.headline, s.rise, s.d3)}>
              You're almost
              <br />
              <span className={s.headlineAccent}>there</span>.
            </h1>
            <p className={cx(s.heroDescription, s.rise, s.d4)}>
              Just one more step to unlock the full AutoVault experience. Check
              your inbox and verify your email.
            </p>
            <div className={cx(s.stepsList, s.rise, s.d5)}>
              {[
                {
                  number: "✓",
                  title: "Create your account",
                  desc: "Account created successfully",
                  state: "completed",
                },
                {
                  number: "2",
                  title: "Verify your email",
                  desc: "Check your inbox",
                  state: "active",
                },
                {
                  number: "3",
                  title: "Start exploring",
                  desc: "Browse premium vehicles",
                  state: "pending",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className={
                    step.state === "completed"
                      ? s.stepCompleted
                      : step.state === "active"
                        ? s.stepActive
                        : s.step
                  }
                >
                  <div
                    className={
                      step.state === "completed"
                        ? s.stepNumberCompleted
                        : step.state === "active"
                          ? s.stepNumberActive
                          : s.stepNumber
                    }
                  >
                    {step.number}
                  </div>
                  <div>
                    <div className={s.stepTitle}>{step.title}</div>
                    <div className={s.stepDesc}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={s.heroContent}>
            <div className={cx(s.statsRow, s.rise, s.d7)}>
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

        {/* Right panel — email verification message */}
        <div className={s.formPanel}>
          <div className={s.formInner}>
            {/* Mobile logo */}
            <div className={cx(s.mobileLogo, s.fade, s.d1)}>
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

            {/* Email icon */}
            <div className={cx(s.successIconWrap, s.rise, s.d2)}>
              <div className={s.successIconCircle}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--success)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 6L2 7" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className={cx(s.headingWrap, s.rise, s.d3)}>
              <h2 className={s.formHeading}>Check your email</h2>
              <p className={s.formSubheading}>
                We've sent a verification link to{" "}
                {actionData.user?.email && (
                  <strong style={{ color: "var(--white)" }}>
                    {actionData.user.email}
                  </strong>
                )}
              </p>
            </div>

            {/* Instructions */}
            <div className={cx(s.verifyInstructions, s.rise, s.d4)}>
              <div className={s.verifyStep}>
                <div className={s.verifyStepIcon}>
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
                </div>
                <div>
                  <div className={s.verifyStepTitle}>Open your email</div>
                  <div className={s.verifyStepDesc}>
                    Look for an email from AutoVault
                  </div>
                </div>
              </div>
              <div className={s.verifyStep}>
                <div className={s.verifyStepIcon}>
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
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
                <div>
                  <div className={s.verifyStepTitle}>
                    Click the verification link
                  </div>
                  <div className={s.verifyStepDesc}>
                    This will activate your account
                  </div>
                </div>
              </div>
              <div className={s.verifyStep}>
                <div className={s.verifyStepIcon}>
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
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <div className={s.verifyStepTitle}>Start exploring</div>
                  <div className={s.verifyStepDesc}>
                    Browse thousands of premium vehicles
                  </div>
                </div>
              </div>
            </div>

            {/* Resend info */}
            {/* Resend info */}
            <div className={cx(s.resendWrap, s.fade, s.d5)}>
              {resendStatus === "sent" ? (
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
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className={s.alertSuccessText}>
                    Verification email resent! Check your inbox.
                  </span>
                </div>
              ) : resendStatus === "error" ? (
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
                  <span className={s.alertErrorText}>
                    Failed to resend. Please try again.
                  </span>
                </div>
              ) : (
                <p className={s.resendText}>
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    type="button"
                    className={s.resendLink}
                    disabled={resendStatus === "sending"}
                    onClick={async () => {
                      setResendStatus("sending");
                      try {
                        await resendVerificationEmail(
                          actionData.user?.email || "",
                        );
                        setResendStatus("sent");
                      } catch {
                        setResendStatus("error");
                      }
                    }}
                  >
                    {resendStatus === "sending"
                      ? "Sending…"
                      : "resend verification email"}
                  </button>
                </p>
              )}
            </div>

            {/* Divider */}
            <div className={cx(s.divider, s.fade, s.d6)}>
              <div className={s.dividerLine} />
              <span className={s.dividerText}>or</span>
              <div className={s.dividerLine} />
            </div>

            {/* Go to login */}
            <a
              href="/auth/login"
              className={cx(s.btnPrimary, s.rise, s.d7)}
              style={{
                textDecoration: "none",
                textAlign: "center",
                display: "block",
              }}
            >
              Go to Sign In
            </a>

            {/* Trust badge */}
            <div className={cx(s.trustBadge, s.fade, s.d7)}>
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

  // ===== FORM =====
  return (
    <div className={s.register}>
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

        {/* Headline + Steps */}
        <div className={cx(s.heroContent, s.heroMiddle)}>
          <div
            className={cx(s.accentBar, mounted && s.fade, mounted && s.d2)}
          />

          <h1 className={cx(s.headline, mounted && s.rise, mounted && s.d3)}>
            Start your
            <br />
            automotive
            <br />
            <span className={s.headlineAccent}>journey</span> today.
          </h1>

          <p
            className={cx(
              s.heroDescription,
              mounted && s.rise,
              mounted && s.d4,
            )}
          >
            Join thousands of buyers and sellers on the most trusted car
            marketplace. Create your free account in seconds.
          </p>

          <div className={cx(s.stepsList, mounted && s.rise, mounted && s.d5)}>
            {[
              {
                number: "1",
                title: "Create your account",
                desc: "Fill in your personal details",
              },
              {
                number: "2",
                title: "Verify your email",
                desc: "Confirm your email address",
              },
              {
                number: "3",
                title: "Start exploring",
                desc: "Browse premium vehicles",
              },
            ].map((step, i) => (
              <div key={i} className={i === 0 ? s.stepActive : s.step}>
                <div className={i === 0 ? s.stepNumberActive : s.stepNumber}>
                  {step.number}
                </div>
                <div>
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
            <h2 className={s.formHeading}>Create account</h2>
            <p className={s.formSubheading}>
              Fill in your details to get started
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

          {/* Form */}
          <Form method="post">
            {/* First Name + Last Name */}
            <div className={cx(s.fieldRow, mounted && s.rise, mounted && s.d3)}>
              <div>
                <label className={s.fieldLabel}>First Name</label>
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
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    required
                    className={s.input}
                  />
                </div>
              </div>
              <div>
                <label className={s.fieldLabel}>Last Name</label>
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
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    required
                    className={s.input}
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div
              className={cx(s.fieldGroup, mounted && s.rise, mounted && s.d4)}
            >
              <label className={s.fieldLabel}>Username</label>
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
                  <path d="M12 2a10 10 0 00-7.35 16.76A10 10 0 0012 22a10 10 0 007.35-3.24A10 10 0 0012 2z" />
                  <path d="M15 9a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M5.68 18.71A7 7 0 0112 15a7 7 0 016.32 3.71" />
                </svg>
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  required
                  className={s.input}
                />
              </div>
            </div>

            {/* Email */}
            <div
              className={cx(s.fieldGroup, mounted && s.rise, mounted && s.d5)}
            >
              <label className={s.fieldLabel}>Email</label>
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
                  placeholder="john@example.com"
                  required
                  className={s.input}
                />
              </div>
            </div>

            {/* Role */}
            <div
              className={cx(s.fieldGroup, mounted && s.rise, mounted && s.d6)}
            >
              <label className={s.fieldLabel}>I want to</label>
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
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                <select
                  name="role"
                  required
                  className={s.select}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="guest">Guest</option>
                  <option value="buyer">Buy vehicles</option>
                  <option value="seller">Sell vehicles</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div
              className={cx(s.fieldGroup, mounted && s.rise, mounted && s.d7)}
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

              {/* Password strength indicator */}
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

            {/* Terms */}
            <div
              className={cx(s.termsLabel, mounted && s.rise, mounted && s.d8)}
              onClick={() => setAgreedToTerms(!agreedToTerms)}
            >
              <input
                title="agreedTerms"
                type="checkbox"
                className={s.termsCheckbox}
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className={s.termsText}>
                I agree to the{" "}
                <Link
                  to="/auth/terms"
                  className={s.termsLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/auth/privacy-policy"
                  className={s.termsLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>
              </span>
            </div>

            {/* Submit */}
            <div className={cx(mounted && s.rise, mounted && s.d9)}>
              <button
                type="submit"
                disabled={isSubmitting || !agreedToTerms}
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
                    Creating account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </Form>

          {/* Divider */}
          <div className={cx(s.divider, mounted && s.fade, mounted && s.d9)}>
            <div className={s.dividerLine} />
            <span className={s.dividerText}>or sign up with</span>
            <div className={s.dividerLine} />
          </div>

          {/* OAuth */}
          <div className={cx(s.oauthGrid, mounted && s.rise, mounted && s.d9)}>
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

          {/* Sign in link */}
          <div
            className={cx(s.signInWrap, mounted && s.fade, mounted && s.d10)}
          >
            <p className={s.signInText}>
              Already have an account?{" "}
              <Link to="/auth/login" className={s.signInLink}>
                Sign In
              </Link>
            </p>
          </div>

          {/* Trust badge */}
          <div
            className={cx(s.trustBadge, mounted && s.fade, mounted && s.d10)}
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
            <span className={s.trustText}>
              Protected with 256-bit SSL encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
