/** A fixed palette of background colors for avatars */
const AVATAR_COLORS = [
  "rgba(230,57,70,0.25)",
  "rgba(59,130,246,0.25)",
  "rgba(16,185,129,0.25)",
  "rgba(245,158,11,0.25)",
  "rgba(139,92,246,0.25)",
  "rgba(236,72,153,0.25)",
];

/** Derives a consistent color index from a username string */
export function getAvatarColor(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Returns the first 1–2 uppercase initials from a username */
export function getAvatarInitials(username: string): string {
  const parts = username.trim().split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}
