// ─── Help & Support Page Constants ────────────────────────────────────────────

import type {
  FaqItem,
  Guide,
  ContactChannel,
} from "~/interface/helpSupport.interface";

export const HELP_TABS = [
  { key: "faq", label: "FAQ" },
  { key: "guides", label: "Getting Started" },
  { key: "contact", label: "Contact Us" },
] as const;

export type HelpTab = (typeof HELP_TABS)[number]["key"];

export const FAQ_CATEGORIES = [
  "All",
  "Listings",
  "Buying",
  "Payments",
  "Account",
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I list a vehicle?",
    answer:
      'Go to My Listings and click "+ New Listing". Fill in your vehicle details, upload photos, set your price, and publish.',
    category: "Listings",
  },
  {
    question: "How do bids work?",
    answer:
      "Buyers can place bids on your listings. You'll receive notifications and can accept, reject, or counter any bid from your dashboard.",
    category: "Buying",
  },
  {
    question: "How do I get paid when my vehicle sells?",
    answer:
      "Payments are processed through your Wallet. Once a sale is confirmed, the funds will appear in your pending balance and can be withdrawn.",
    category: "Payments",
  },
  {
    question: "Can I edit a listing after publishing?",
    answer:
      "Yes! Go to My Listings, click on the listing you want to edit, and make your changes. Updates are reflected immediately.",
    category: "Listings",
  },
  {
    question: "How do I contact a seller?",
    answer:
      'On any vehicle listing page, click the "Message Seller" button to start a conversation. All messages are available in your Messages tab.',
    category: "Buying",
  },
  {
    question: "What is the Compare feature?",
    answer:
      "Compare lets you view up to 4 vehicles side-by-side, comparing specs, pricing, features, and a similarity score.",
    category: "Buying",
  },
  {
    question: "How do I withdraw funds from my Wallet?",
    answer:
      "Navigate to your Wallet, click Withdraw, enter the amount, and select your preferred payout method. Withdrawals typically process in 1–3 business days.",
    category: "Payments",
  },
  {
    question: "How do I change my password?",
    answer:
      "Go to Settings → Security and click Change Password. You'll need to enter your current password and choose a new one.",
    category: "Account",
  },
];

export const GUIDES: Guide[] = [
  {
    title: "Listing Your First Vehicle",
    description:
      "A step-by-step guide to creating your first listing on AutoVault.",
    icon: "listing",
    steps: [
      {
        title: "Navigate to My Listings",
        description:
          "From the sidebar, click on My Listings to view your listings dashboard.",
      },
      {
        title: "Click New Listing",
        description:
          "Click the + New Listing button to start the listing wizard.",
      },
      {
        title: "Fill in Vehicle Details",
        description:
          "Enter the make, model, year, mileage, and other key details about your vehicle.",
      },
      {
        title: "Upload Photos",
        description:
          "Add up to 20 high-quality photos. Listings with more photos get more views.",
      },
      {
        title: "Set Your Price & Publish",
        description:
          "Choose a price, review your listing, and publish it for buyers to see.",
      },
    ],
  },
  {
    title: "Buying a Vehicle",
    description:
      "Learn how to find, compare, and purchase vehicles on AutoVault.",
    icon: "buying",
    steps: [
      {
        title: "Browse or Search",
        description:
          "Use the Find Vehicles page to search by make, model, price, and more.",
      },
      {
        title: "Save & Compare",
        description:
          "Save vehicles you like and use the Compare tool to view them side-by-side.",
      },
      {
        title: "Place a Bid or Message Seller",
        description:
          "Make an offer via the bid system or message the seller directly.",
      },
      {
        title: "Complete the Purchase",
        description:
          "Once your bid is accepted, follow the checkout flow to finalize the transaction.",
      },
    ],
  },
  {
    title: "Managing Your Wallet",
    description:
      "Everything you need to know about payments, deposits, and withdrawals.",
    icon: "wallet",
    steps: [
      {
        title: "Access Your Wallet",
        description:
          "Navigate to the Wallet section from the sidebar to view your balance.",
      },
      {
        title: "Add Funds",
        description:
          "Click Deposit and choose your payment method to add funds to your account.",
      },
      {
        title: "Withdraw Earnings",
        description:
          "After a sale, click Withdraw and select your preferred payout method.",
      },
    ],
  },
];

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    label: "Email Support",
    value: "support@autovault.com",
    description:
      "Get a response within 24 hours. Best for non-urgent inquiries.",
    icon: "email",
    action: "Send Email",
  },
  {
    label: "Live Chat",
    value: "Mon–Fri, 9 AM – 6 PM EET",
    description: "Chat with a support agent in real-time for immediate help.",
    icon: "chat",
    action: "Start Chat",
  },
  {
    label: "Knowledge Base",
    value: "100+ articles & guides",
    description:
      "Browse our comprehensive library of tutorials and documentation.",
    icon: "book",
    action: "Browse Articles",
  },
  {
    label: "Community Forum",
    value: "Join 5,000+ members",
    description:
      "Ask questions, share tips, and connect with other AutoVault users.",
    icon: "community",
    action: "Visit Forum",
  },
];
