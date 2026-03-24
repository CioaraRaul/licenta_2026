import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import {
  HELP_TABS,
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  GUIDES,
  CONTACT_CHANNELS,
  type HelpTab,
} from "~/constants/helpSupport.constants";
import type { Guide } from "~/interface/helpSupport.interface";

/* ─── Icons ─────────────────────────────────────────────────────────────────── */

const ChannelIcons: Record<string, ReactNode> = {
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e63946" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  chat: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  book: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  community: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
};

const GuideIcons: Record<string, ReactNode> = {
  listing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e63946" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  buying: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  ),
  wallet: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
};

const TabIcons: Record<HelpTab, ReactNode> = {
  faq: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  guides: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  contact: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
};

/* ─── Main component ────────────────────────────────────────────────────────── */

export default function HelpSupportComponent() {
  const [activeTab, setActiveTab] = useState<HelpTab>("faq");
  const [activeFaqCategory, setActiveFaqCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQ_ITEMS.filter((faq) => {
    const matchesCategory =
      activeFaqCategory === "All" || faq.category === activeFaqCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* ─── Tab renderers ───────────────────────────────────────────────────────── */

  const renderFaq = () => (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8e9a]"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions..."
          className="w-full bg-[#141417] border border-white/[0.04] rounded-xl pl-10 pr-4 py-3 text-[14px] text-[#f5f5f7] placeholder-[#555] outline-none focus:border-[#e63946]/30 transition-colors"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {FAQ_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFaqCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              activeFaqCategory === cat
                ? "bg-[#e63946]/10 text-[#e63946] border border-[#e63946]/20"
                : "bg-white/[0.03] text-[#8e8e9a] border border-white/[0.04] hover:text-[#c2c2c9] hover:bg-white/[0.05]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ list */}
      <div className="space-y-2">
        {filteredFaqs.length === 0 ? (
          <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-8 text-center">
            <svg
              className="mx-auto mb-3 opacity-30"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8e8e9a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-[14px] text-[#8e8e9a]">
              No questions match your search.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 pr-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-[#e63946]/10 flex items-center justify-center text-[11px] font-bold text-[#e63946]">
                      ?
                    </span>
                    <span className="text-[14px] font-medium text-[#f5f5f7]">
                      {faq.question}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline px-2 py-0.5 rounded text-[11px] font-medium bg-white/[0.04] text-[#8e8e9a]">
                      {faq.category}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8e8e9a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-0 border-t border-white/[0.04]">
                    <p className="text-[14px] text-[#8e8e9a] leading-relaxed pt-3 pl-9">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderGuides = () => (
    <div className="space-y-5">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-[#e63946]/10 via-[#e63946]/5 to-transparent border border-[#e63946]/10 rounded-xl p-5">
        <h3 className="text-[16px] font-semibold text-[#f5f5f7] mb-1">
          New to AutoVault?
        </h3>
        <p className="text-[13px] text-[#8e8e9a] leading-relaxed">
          Follow these step-by-step guides to get up and running quickly. Each
          guide walks you through a key workflow on the platform.
        </p>
      </div>

      {/* Guide cards */}
      <div className="space-y-4">
        {GUIDES.map((guide: Guide) => {
          const isExpanded = expandedGuide === guide.title;
          return (
            <div
              key={guide.title}
              className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedGuide(isExpanded ? null : guide.title)
                }
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                  {GuideIcons[guide.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-[#f5f5f7]">
                    {guide.title}
                  </h3>
                  <p className="text-[13px] text-[#8e8e9a] mt-0.5 truncate">
                    {guide.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline text-[12px] text-[#555] font-medium">
                    {guide.steps.length} steps
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8e8e9a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-white/[0.04] px-5 py-4">
                  <div className="space-y-0">
                    {guide.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="flex gap-4">
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full bg-[#e63946]/10 border border-[#e63946]/20 flex items-center justify-center text-[12px] font-bold text-[#e63946] shrink-0">
                            {stepIdx + 1}
                          </div>
                          {stepIdx < guide.steps.length - 1 && (
                            <div className="w-px flex-1 bg-white/[0.06] my-1" />
                          )}
                        </div>
                        {/* Content */}
                        <div
                          className={`pb-4 ${stepIdx === guide.steps.length - 1 ? "pb-0" : ""}`}
                        >
                          <p className="text-[14px] font-medium text-[#f5f5f7]">
                            {step.title}
                          </p>
                          <p className="text-[13px] text-[#8e8e9a] mt-0.5 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONTACT_CHANNELS.map((channel) => (
          <div
            key={channel.label}
            className="bg-[#141417] border border-white/[0.04] rounded-xl p-5 hover:border-white/[0.08] transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {ChannelIcons[channel.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-[#f5f5f7]">
                  {channel.label}
                </h3>
                <p className="text-[13px] text-[#e63946] font-medium mt-0.5">
                  {channel.value}
                </p>
                <p className="text-[12px] text-[#8e8e9a] mt-1.5 leading-relaxed">
                  {channel.description}
                </p>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-[#c2c2c9] font-medium hover:bg-white/[0.07] transition-colors">
              {channel.action}
            </button>
          </div>
        ))}
      </div>

      {/* Submit a ticket */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h3 className="text-[15px] font-semibold text-[#f5f5f7]">
            Submit a Support Ticket
          </h3>
          <p className="text-[13px] text-[#8e8e9a] mt-0.5">
            Can't find what you're looking for? Describe your issue below and
            we'll get back to you.
          </p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[13px] text-[#8e8e9a] font-medium mb-1.5 block">
              Subject
            </label>
            <input
              type="text"
              placeholder="Brief description of your issue"
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-[14px] text-[#f5f5f7] placeholder-[#555] outline-none focus:border-[#e63946]/30 transition-colors"
            />
          </div>
          <div>
            <label className="text-[13px] text-[#8e8e9a] font-medium mb-1.5 block">
              Category
            </label>
            <select className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-[14px] text-[#f5f5f7] outline-none focus:border-[#e63946]/30 transition-colors cursor-pointer">
              <option value="" className="bg-[#1a1a1f]">Select a category</option>
              <option value="billing" className="bg-[#1a1a1f]">Billing & Payments</option>
              <option value="listings" className="bg-[#1a1a1f]">Listings</option>
              <option value="account" className="bg-[#1a1a1f]">Account Issues</option>
              <option value="bug" className="bg-[#1a1a1f]">Bug Report</option>
              <option value="feature" className="bg-[#1a1a1f]">Feature Request</option>
              <option value="other" className="bg-[#1a1a1f]">Other</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] text-[#8e8e9a] font-medium mb-1.5 block">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Describe your issue in detail..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3.5 py-2.5 text-[14px] text-[#f5f5f7] placeholder-[#555] outline-none focus:border-[#e63946]/30 transition-colors resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button className="px-5 py-2.5 bg-[#e63946] hover:bg-[#d32f3f] rounded-lg text-[14px] text-white font-medium transition-colors">
              Submit Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Status info */}
      <div className="bg-[#141417] border border-white/[0.04] rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
          <div>
            <p className="text-[14px] text-[#f5f5f7] font-medium">
              All Systems Operational
            </p>
            <p className="text-[12px] text-[#8e8e9a] mt-0.5">
              Average response time: &lt;2 hours during business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const tabContent: Record<HelpTab, () => ReactNode> = {
    faq: renderFaq,
    guides: renderGuides,
    contact: renderContact,
  };

  /* ─── Render ──────────────────────────────────────────────────────────────── */

  return (
    <div className="flex-1 overflow-y-auto p-6 font-['DM_Sans',sans-serif]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[14px] text-[#8e8e9a] mb-3">
            <Link
              to="/dashboard"
              className="hover:text-[#f5f5f7] transition-colors no-underline text-[#8e8e9a]"
            >
              Dashboard
            </Link>
            <span className="text-[#555]">/</span>
            <span className="text-[#f5f5f7]">Help & Support</span>
          </div>
          <h1 className="font-['Playfair_Display',serif] text-[28px] font-bold text-[#f5f5f7] tracking-tight">
            Help & Support
          </h1>
          <p className="text-[15px] text-[#8e8e9a] mt-1">
            Find answers, follow guides, or get in touch with our team.
          </p>
        </div>

        {/* Layout: sidebar tabs + content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-[200px] shrink-0 hidden md:block">
            <nav className="space-y-1 sticky top-6">
              {HELP_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all text-left ${
                    activeTab === key
                      ? "bg-[#e63946]/10 text-[#e63946]"
                      : "text-[#8e8e9a] hover:text-[#c2c2c9] hover:bg-white/[0.03]"
                  }`}
                >
                  {TabIcons[key]}
                  {label}
                </button>
              ))}

              {/* Quick stats */}
              <div className="pt-4 mt-4 border-t border-white/[0.04] space-y-3">
                <div className="px-3">
                  <p className="text-[11px] uppercase tracking-wider text-[#555] font-semibold mb-2">
                    Quick Info
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span className="text-[12px] text-[#8e8e9a]">
                        Support Online
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                      <span className="text-[12px] text-[#8e8e9a]">
                        Avg. reply: &lt;2h
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                      <span className="text-[12px] text-[#8e8e9a]">
                        {FAQ_ITEMS.length} FAQ articles
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile tab bar */}
            <div className="flex gap-1 mb-5 overflow-x-auto pb-1 md:hidden">
              {HELP_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`shrink-0 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                    activeTab === key
                      ? "bg-[#e63946]/10 text-[#e63946]"
                      : "text-[#8e8e9a] hover:bg-white/[0.03]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tabContent[activeTab]()}
          </div>
        </div>
      </div>
    </div>
  );
}
