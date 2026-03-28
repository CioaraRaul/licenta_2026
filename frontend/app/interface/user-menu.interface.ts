import type { JSX } from "react";

export interface UserMenuItem {
  label: string;
  icon: JSX.Element;
  to?: string;
  action?: string;
}
