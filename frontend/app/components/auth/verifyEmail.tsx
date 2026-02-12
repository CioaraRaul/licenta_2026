import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { exchangeVerificationCode, verifyEmail } from "~/api/auth.api";

function VerifyEmailComponent({ code }: { code: string }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState<string>("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (!code || calledRef.current) return;
    calledRef.current = true;

    async function doVerify() {
      try {
        const { verificationToken } = await exchangeVerificationCode(code);
        await verifyEmail(verificationToken);
        setStatus("success");
      } catch (error: any) {
        setErrorMsg(
          error.data?.message || "Failed to verify email. Please try again.",
        );
        setStatus("error");
      }
    }

    doVerify();
  }, [code]);

  // ===== LOADING =====
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center p-6 relative overflow-hidden font-['DM_Sans',sans-serif]">
        <div className="absolute top-[-30%] right-[-15%] w-1/2 h-[160%] bg-gradient-to-br from-[rgba(230,57,70,0.12)] to-transparent skew-x-[-12deg] z-0" />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 w-full max-w-[440px] bg-[#141417] border border-white/[0.04] rounded-2xl p-11 shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
          <a href="/" className="flex items-center gap-2.5 mb-9 no-underline">
            <div className="w-9 h-9 rounded-lg bg-[#e63946] flex items-center justify-center">
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
            <span className="font-['Playfair_Display',serif] text-lg font-bold text-[#f5f5f7] tracking-tight">
              AutoVault
            </span>
          </a>

          <div className="flex flex-col items-center text-center py-8">
            <div className="w-14 h-14 rounded-full bg-[rgba(230,57,70,0.12)] flex items-center justify-center mb-6">
              <svg
                className="animate-spin"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#26262d"
                  strokeWidth="3"
                />
                <path
                  d="M12 2a10 10 0 019.95 9"
                  stroke="#e63946"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="font-['Playfair_Display',serif] text-[28px] font-bold text-[#f5f5f7] tracking-tight mb-2">
              Verifying your email
            </h1>
            <p className="text-[15px] text-[#8e8e9a] leading-relaxed">
              Please wait while we confirm your email address…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===== ERROR =====
  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center p-6 relative overflow-hidden font-['DM_Sans',sans-serif]">
        <div className="absolute top-[-30%] right-[-15%] w-1/2 h-[160%] bg-gradient-to-br from-[rgba(230,57,70,0.12)] to-transparent skew-x-[-12deg] z-0" />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 w-full max-w-[440px] bg-[#141417] border border-white/[0.04] rounded-2xl p-11 shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
          <a href="/" className="flex items-center gap-2.5 mb-9 no-underline">
            <div className="w-9 h-9 rounded-lg bg-[#e63946] flex items-center justify-center">
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
            <span className="font-['Playfair_Display',serif] text-lg font-bold text-[#f5f5f7] tracking-tight">
              AutoVault
            </span>
          </a>

          {/* Error icon */}
          <div className="w-14 h-14 rounded-full bg-[rgba(230,57,70,0.12)] flex items-center justify-center mb-6">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e63946"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          <h1 className="font-['Playfair_Display',serif] text-[28px] font-bold text-[#f5f5f7] tracking-tight mb-2">
            Verification failed
          </h1>
          <p className="text-[15px] text-[#8e8e9a] leading-relaxed mb-7">
            {errorMsg}
          </p>

          {/* Error detail box */}
          <div className="mb-6 p-3 bg-[rgba(230,57,70,0.12)] border border-[rgba(230,57,70,0.2)] rounded-[10px] flex items-center gap-2.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e63946"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-[13.5px] text-[#f87171] font-medium">
              The link may have expired or already been used
            </span>
          </div>

          <Link
            to="/auth/register"
            className="block w-full py-[15px] px-6 bg-[#e63946] rounded-[10px] text-white text-center text-[15px] font-semibold tracking-wide no-underline hover:translate-y-[-1px] hover:shadow-[0_8px_28px_rgba(230,57,70,0.35)] transition-all duration-300"
          >
            Create New Account
          </Link>

          <a
            href="/auth/login"
            className="flex items-center justify-center gap-1.5 mt-6 text-sm text-[#8e8e9a] no-underline hover:text-[#f5f5f7] transition-colors"
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
          </a>

          <div className="flex items-center justify-center gap-1.5 mt-6 pt-5 border-t border-white/[0.04]">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8e8e9a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-xs text-[#8e8e9a]">
              Protected with 256-bit SSL encryption
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ===== SUCCESS =====
  return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center p-6 relative overflow-hidden font-['DM_Sans',sans-serif]">
      <div className="absolute top-[-30%] right-[-15%] w-1/2 h-[160%] bg-gradient-to-br from-[rgba(230,57,70,0.12)] to-transparent skew-x-[-12deg] z-0" />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 w-full max-w-[440px] bg-[#141417] border border-white/[0.04] rounded-2xl p-11 shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 mb-9 no-underline">
          <div className="w-9 h-9 rounded-lg bg-[#e63946] flex items-center justify-center">
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
          <span className="font-['Playfair_Display',serif] text-lg font-bold text-[#f5f5f7] tracking-tight">
            AutoVault
          </span>
        </a>

        {/* Success icon */}
        <div className="w-14 h-14 rounded-full bg-[rgba(16,185,129,0.12)] flex items-center justify-center mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="font-['Playfair_Display',serif] text-[28px] font-bold text-[#f5f5f7] tracking-tight mb-2">
          Email verified!
        </h1>
        <p className="text-[15px] text-[#8e8e9a] leading-relaxed mb-7">
          Your email has been confirmed successfully. You now have full access
          to all AutoVault features.
        </p>

        {/* Features unlocked */}
        <div className="flex flex-col gap-3 mb-7">
          {[
            {
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e63946"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              ),
              title: "Contact sellers directly",
              desc: "Message vehicle owners instantly",
            },
            {
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e63946"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              ),
              title: "Save your favorites",
              desc: "Bookmark vehicles you love",
            },
            {
              icon: (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e63946"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              title: "Secure transactions",
              desc: "Escrow-protected payments",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 p-3.5 bg-white/[0.03] border border-white/[0.04] rounded-[10px]"
            >
              <div className="w-9 h-9 rounded-lg bg-[rgba(230,57,70,0.12)] flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#e8e8ed] mb-0.5">
                  {item.title}
                </div>
                <div className="text-[12.5px] text-[#8e8e9a]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          to="/"
          className="block w-full py-[15px] px-6 bg-[#e63946] rounded-[10px] text-white text-center text-[15px] font-semibold tracking-wide no-underline hover:translate-y-[-1px] hover:shadow-[0_8px_28px_rgba(230,57,70,0.35)] transition-all duration-300"
        >
          Start Exploring
        </Link>

        <a
          href="/auth/login"
          className="flex items-center justify-center gap-2 mt-3 w-full py-3.5 px-6 bg-transparent border border-white/[0.08] rounded-[10px] text-[#bbbbc6] text-sm font-medium no-underline hover:bg-white/[0.04] hover:border-white/[0.12] hover:text-[#f5f5f7] transition-all"
        >
          Go to Sign In
        </a>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-1.5 mt-6 pt-5 border-t border-white/[0.04]">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8e8e9a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-xs text-[#8e8e9a]">
            Protected with 256-bit SSL encryption
          </span>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailComponent;
