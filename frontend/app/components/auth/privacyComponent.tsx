// routes/privacy.tsx
import { useEffect, useState } from "react";
import s from "./privacy-tems.module.css";

const sections = [
  {
    id: "overview",
    title: "Overview",
    content: [
      "At AutoVault, your privacy matters. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform.",
      "By using AutoVault, you consent to the data practices described in this policy. We encourage you to read it carefully.",
    ],
  },
  {
    id: "collection",
    title: "Information We Collect",
    content: [
      "We collect information that you provide directly and information that is generated automatically when you use our platform.",
    ],
    subsections: [
      {
        title: "Information You Provide",
        list: [
          "Account details: name, username, email address, and password",
          "Profile information: bio, profile photo, and contact preferences",
          "Listing data: vehicle details, photos, pricing, and descriptions",
          "Communications: messages between buyers and sellers",
          "Payment information: when using our escrow service",
        ],
      },
      {
        title: "Automatically Collected",
        list: [
          "Device information: browser type, operating system, device identifiers",
          "Usage data: pages visited, features used, search queries",
          "Location data: approximate location based on IP address",
          "Cookies and similar technologies for session management",
        ],
      },
    ],
  },
  {
    id: "usage",
    title: "How We Use Your Information",
    content: [
      "We use the information we collect to provide, maintain, and improve AutoVault's services.",
    ],
    list: [
      "Create and manage your account",
      "Display vehicle listings and facilitate buyer-seller connections",
      "Process transactions through our escrow service",
      "Send email verification and account security notifications",
      "Provide customer support and respond to inquiries",
      "Detect and prevent fraud, abuse, and security threats",
      "Analyze usage patterns to improve our platform",
      "Send relevant notifications about listings and account activity",
    ],
    highlight:
      "We will never sell your personal information to third parties. Your data is used solely to power and improve the AutoVault experience.",
  },
  {
    id: "sharing",
    title: "Information Sharing",
    content: ["We share your information only in limited circumstances:"],
    list: [
      "With other users: your public profile and listing information is visible to other AutoVault users",
      "With service providers: trusted third parties that help us operate our platform (hosting, email, payment processing)",
      "For legal compliance: when required by law, court order, or government regulation",
      "Business transfers: in the event of a merger, acquisition, or sale of assets",
      "With your consent: when you explicitly authorize sharing with a third party",
    ],
    info: {
      title: "Seller Visibility",
      text: "When you list a vehicle, your seller profile (username, rating, and general location) is visible to potential buyers. Your email address and phone number are only shared when you explicitly choose to make them public.",
    },
  },
  {
    id: "security",
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.",
    ],
    list: [
      "All data transmitted to and from AutoVault is encrypted using 256-bit SSL/TLS",
      "Passwords are hashed using cryptographic algorithms and never stored in plain text",
      "Access to user data is restricted to authorized personnel only",
      "We conduct regular security audits and vulnerability assessments",
      "JWT tokens are used for session management with automatic expiration",
    ],
    highlight:
      "While we strive to protect your data, no method of electronic transmission or storage is 100% secure. We encourage you to use strong, unique passwords and enable two-factor authentication when available.",
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    content: [
      "AutoVault uses cookies and similar technologies to enhance your experience.",
    ],
    subsections: [
      {
        title: "Essential Cookies",
        list: [
          "Authentication tokens to keep you signed in",
          "Session management and security",
          "User preference storage (theme, language)",
        ],
      },
      {
        title: "Analytics Cookies",
        list: [
          "Aggregate usage statistics to improve our platform",
          "Performance monitoring and error tracking",
          "Feature usage analysis",
        ],
      },
    ],
  },
  {
    id: "rights",
    title: "Your Rights",
    content: ["You have the following rights regarding your personal data:"],
    list: [
      "Access: request a copy of all personal data we hold about you",
      "Correction: update or correct inaccurate personal information",
      "Deletion: request deletion of your account and associated data",
      "Export: download your data in a portable format",
      "Opt-out: unsubscribe from marketing communications at any time",
      "Deactivation: temporarily deactivate your account while retaining your data",
    ],
    info: {
      title: "Exercising Your Rights",
      text: "You can manage most of these options directly from your Account Settings. For data access requests or account deletion, you can use the built-in features or contact our support team.",
    },
  },
  {
    id: "retention",
    title: "Data Retention",
    content: [
      "We retain your personal information for as long as your account is active or as needed to provide our services. After account deletion:",
    ],
    list: [
      "Account data is permanently deleted within 30 days",
      "Listing data may be retained in anonymized form for analytics",
      "Transaction records are retained for 7 years as required by law",
      "Backup copies are purged within 90 days of deletion",
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: [
      "AutoVault is not intended for users under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a child under 18 has provided us with personal data, we will take steps to delete that information promptly.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of significant changes via email or a prominent notice on our platform.",
      "We recommend reviewing this policy periodically. Your continued use of AutoVault after any changes indicates acceptance of the updated policy.",
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    content: [
      "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out to us.",
    ],
  },
];

export default function PrivacyPolicy() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cx = (...classes: (string | false | undefined)[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <div className={s.page}>
      {/* Header */}
      <header className={s.header}>
        <div className={s.headerInner}>
          <a href="/" className={s.logoWrap}>
            <div className={s.logoIcon}>
              <svg
                width="16"
                height="16"
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
          <a href="/auth/register" className={s.backLink}>
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
            Back to Register
          </a>
        </div>
      </header>

      {/* Hero Banner */}
      <div className={s.heroBanner}>
        <div className={s.grain} />
        <div className={s.heroBannerInner}>
          <div className={cx(s.badge, mounted && s.fade, mounted && s.d1)}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Privacy
          </div>
          <h1 className={cx(s.heroTitle, mounted && s.rise, mounted && s.d2)}>
            Privacy Policy
          </h1>
          <p className={cx(s.heroSubtitle, mounted && s.rise, mounted && s.d3)}>
            Your privacy is important to us. Learn how AutoVault collects, uses,
            and protects your personal information.
          </p>
          <div className={cx(s.metaRow, mounted && s.fade, mounted && s.d4)}>
            <span className={s.metaItem}>
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Last updated: February 2026
            </span>
            <div className={s.metaDot} />
            <span className={s.metaItem}>
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
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              12 min read
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={cx(s.content, mounted && s.rise, mounted && s.d5)}>
        {/* Table of Contents */}
        <div className={s.toc}>
          <div className={s.tocTitle}>Table of Contents</div>
          <ul className={s.tocList}>
            {sections.map((sec, i) => (
              <li key={sec.id}>
                <a href={`#${sec.id}`} className={s.tocLink}>
                  <span className={s.tocNumber}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {sec.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        {sections.map((sec, i) => (
          <div key={sec.id} id={sec.id} className={s.section}>
            <span className={s.sectionNumber}>
              Section {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className={s.sectionTitle}>{sec.title}</h2>
            {sec.content.map((p, j) => (
              <p key={j} className={s.sectionText}>
                {p}
              </p>
            ))}
            {sec.list && (
              <ul className={s.sectionList}>
                {sec.list.map((item, j) => (
                  <li key={j} className={s.sectionListItem}>
                    <div className={s.listBullet} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {sec.subsections?.map((sub, k) => (
              <div key={k} style={{ marginTop: 16 }}>
                <div className={s.infoTitle}>{sub.title}</div>
                <ul className={s.sectionList}>
                  {sub.list.map((item, j) => (
                    <li key={j} className={s.sectionListItem}>
                      <div className={s.listBullet} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {sec.highlight && (
              <div className={s.highlightBox}>
                <p className={s.highlightText}>{sec.highlight}</p>
              </div>
            )}
            {sec.info && (
              <div className={s.infoBox}>
                <div className={s.infoTitle}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ember)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  {sec.info.title}
                </div>
                <p className={s.infoText}>{sec.info.text}</p>
              </div>
            )}
          </div>
        ))}

        {/* Contact Box */}
        <div className={s.contactBox}>
          <h3 className={s.contactTitle}>Privacy concerns?</h3>
          <p className={s.contactText}>
            Our privacy team is ready to address any questions about your data.
          </p>
          <a href="mailto:cioararaul08@gmail.com" className={s.contactLink}>
            <svg
              width="15"
              height="15"
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
            cioararaul08@gmail.com
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className={s.footer}>
        <p className={s.footerText}>© 2026 AutoVault. All rights reserved.</p>
      </footer>
    </div>
  );
}
