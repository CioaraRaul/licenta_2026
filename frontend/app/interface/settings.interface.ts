export interface NotificationSetting {
  key: string;
  label: string;
  description: string;
}

export interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export interface SettingsSelectOption {
  readonly value: string;
  readonly label: string;
}

export interface SettingsSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly SettingsSelectOption[];
}

export interface ProfileField {
  label: string;
  value: string;
}

export interface ConnectedAccount {
  name: string;
  icon: string;
  connected: boolean;
}

export interface SessionInfo {
  device: string;
  location: string;
  current: boolean;
}

export type ThemeValue = "dark" | "light" | "system";

export interface ThemeOption {
  key: ThemeValue;
  label: string;
  bg: string;
}

export interface ProfileFormState {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
}

export interface PasswordFormState {
  current: string;
  next: string;
  confirm: string;
}

export interface StatusBannerState {
  type: "success" | "error";
  message: string;
}

export type SettingsTab =
  | "profile"
  | "notifications"
  | "security"
  | "preferences";

export interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}
