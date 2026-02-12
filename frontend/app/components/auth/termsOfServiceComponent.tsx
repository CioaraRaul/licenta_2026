import { useEffect, useState } from "react";
import s from "./privacy-tems.module.css";
import { Link } from "react-router";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: [
      "By accessing or using AutoVault, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use our platform.",
      "We reserve the right to update these terms at any time. Continued use of AutoVault after changes constitutes acceptance of the modified terms.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    content: [
      "You must be at least 18 years old to create an account and use AutoVault. By registering, you represent that you meet this age requirement.",
    ],
    list: [
      "You must provide accurate and complete registration information",
      "You are responsible for maintaining the security of your account credentials",
      "You must notify us immediately of any unauthorized use of your account",
      "One person may not maintain more than one account",
    ],
  },
  {
    id: "accounts",
    title: "User Accounts & Roles",
    content: [
      "AutoVault offers different account types to serve both buyers and sellers in the automotive marketplace.",
    ],
    list: [
      "Buyers can browse listings, save favorites, contact sellers, and make offers",
      "Sellers can create vehicle listings, manage inventory, and communicate with potential buyers",
      "Account roles may be changed by contacting our support team",
      "We reserve the right to suspend or terminate accounts that violate these terms",
    ],
    highlight:
      "All sellers must verify their identity and provide accurate information about listed vehicles. Misrepresentation of vehicle condition, history, or specifications is strictly prohibited.",
  },
  {
    id: "listings",
    title: "Vehicle Listings",
    content: [
      "Sellers are solely responsible for the accuracy of their vehicle listings. All listings must comply with applicable laws and regulations.",
    ],
    list: [
      "Listings must include accurate vehicle details (make, model, year, mileage, condition)",
      "Photos must accurately represent the current state of the vehicle",
      "Pricing must be clearly stated and not misleading",
      "Sold vehicles must be promptly removed or marked as sold",
      "Duplicate listings for the same vehicle are not permitted",
    ],
  },
  {
    id: "transactions",
    title: "Transactions & Payments",
    content: [
      "AutoVault facilitates connections between buyers and sellers. While we provide tools and protections, transactions are ultimately between the buyer and seller.",
    ],
    list: [
      "AutoVault is not a party to any vehicle sale transaction",
      "Escrow-protected payments are available for eligible transactions",
      "All applicable taxes and fees are the responsibility of the respective parties",
      "Disputes between buyers and sellers should first be resolved directly between the parties",
    ],
    info: {
      title: "Payment Protection",
      text: "For transactions using our escrow service, funds are held securely until both parties confirm the transaction is complete. This protects both buyers and sellers.",
    },
  },
  {
    id: "conduct",
    title: "Prohibited Conduct",
    content: ["Users agree not to engage in any of the following activities:"],
    list: [
      "Posting fraudulent, misleading, or deceptive listings",
      "Harassing, threatening, or abusing other users",
      "Using AutoVault for any illegal purpose",
      "Attempting to circumvent our security measures",
      "Scraping, crawling, or automated data collection without authorization",
      "Manipulating ratings, reviews, or feedback systems",
      "Selling stolen vehicles or vehicles with undisclosed liens",
    ],
  },
  {
    id: "ip",
    title: "Intellectual Property",
    content: [
      "All content on AutoVault, including logos, text, graphics, and software, is the property of AutoVault or its licensors and is protected by intellectual property laws.",
      "User-generated content (such as listings and photos) remains the property of the user, but you grant AutoVault a non-exclusive license to display and distribute this content on our platform.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: [
      'AutoVault is provided "as is" without warranties of any kind. We do not guarantee the accuracy of listings, the condition of vehicles, or the reliability of any user.',
    ],
    highlight:
      "AutoVault shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform, including but not limited to vehicle condition issues, transaction disputes, or loss of data.",
  },
  {
    id: "termination",
    title: "Account Termination",
    content: [
      "We may suspend or terminate your account at our discretion, with or without notice, for conduct that we determine violates these terms or is harmful to other users or the platform.",
      "You may deactivate or delete your account at any time through your account settings. Upon deletion, your data will be handled in accordance with our Privacy Policy.",
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    content: [
      "If you have questions about these Terms of Service, please contact us.",
    ],
  },
];

export default function TermsOfServiceComponent() {
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
          <Link to="/auth/register" className={s.backLink}>
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
          </Link>
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
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Legal Document
          </div>
          <h1 className={cx(s.heroTitle, mounted && s.rise, mounted && s.d2)}>
            Terms of Service
          </h1>
          <p className={cx(s.heroSubtitle, mounted && s.rise, mounted && s.d3)}>
            Please read these terms carefully before using AutoVault. They
            govern your access to and use of our platform.
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
              10 min read
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
          <h3 className={s.contactTitle}>Have questions?</h3>
          <p className={s.contactText}>
            If you need clarification about any of these terms, our team is here
            to help.
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
