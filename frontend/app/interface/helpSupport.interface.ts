export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export interface GuideStep {
  title: string;
  description: string;
}

export interface Guide {
  title: string;
  description: string;
  icon: string;
  steps: GuideStep[];
}

export interface ContactChannel {
  label: string;
  value: string;
  description: string;
  icon: string;
  action: string;
}
