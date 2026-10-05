// lib/theme.ts
/**
 * LabourSampark Design Tokens & Theme System
 * 
 * Brand Identity:
 * - Primary: Orange (#EA580C / #F97316) - warmth, energy, accessibility
 * - Secondary: Purple (#7C3AED / #6D28D9) - trust, modernity, reliability
 * - Tagline / Supporting Accent: Green (#16A34A / #10B981) - prosperity, growth, verified trust
 * 
 * Role Color System:
 * - Labour: Blue (#2563EB)
 * - Contractor: Indigo (#4F46E5)
 * - Sub-Contractor: Emerald (#059669)
 */

export const brandTokens = {
  primary: {
    name: "orange",
    hex: "#EA580C",
    hoverHex: "#C2410C",
    bg: "bg-orange-600",
    bgHover: "hover:bg-orange-700",
    bgLight: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500",
    gradient: "from-orange-500 to-amber-500",
  },
  secondary: {
    name: "purple",
    hex: "#7C3AED",
    hoverHex: "#6D28D9",
    bg: "bg-purple-600",
    bgHover: "hover:bg-purple-700",
    bgLight: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500",
    gradient: "from-purple-600 to-indigo-600",
  },
  accent: {
    name: "green",
    hex: "#16A34A",
    hoverHex: "#15803D",
    bg: "bg-green-600",
    bgHover: "hover:bg-green-700",
    bgLight: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-500",
    tagline: "text-green-600 font-semibold tracking-wide",
  },
} as const;

export type UserRole = "labour" | "contractor" | "sub_contractor";

export interface RoleThemeConfig {
  role: UserRole;
  displayName: string;
  colorName: string;
  cardHeader: string;
  button: string;
  border: string;
  bgLight: string;
  textPrimary: string;
  textSecondary: string;
  badge: string;
  iconBg: string;
  iconText: string;
}

export const roleThemes: Record<UserRole, RoleThemeConfig> = {
  labour: {
    role: "labour",
    displayName: "Labour",
    colorName: "blue",
    cardHeader: "bg-blue-600",
    button: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20",
    border: "border-blue-400 dark:border-blue-600",
    bgLight: "bg-blue-50/70 dark:bg-blue-950/20",
    textPrimary: "text-blue-700 dark:text-blue-300",
    textSecondary: "text-blue-800 dark:text-blue-200",
    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconText: "text-blue-600 dark:text-blue-400",
  },
  contractor: {
    role: "contractor",
    displayName: "Contractor",
    colorName: "indigo",
    cardHeader: "bg-indigo-600",
    button: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20",
    border: "border-indigo-400 dark:border-indigo-600",
    bgLight: "bg-indigo-50/70 dark:bg-indigo-950/20",
    textPrimary: "text-indigo-700 dark:text-indigo-300",
    textSecondary: "text-indigo-800 dark:text-indigo-200",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    iconText: "text-indigo-600 dark:text-indigo-400",
  },
  sub_contractor: {
    role: "sub_contractor",
    displayName: "Sub-Contractor",
    colorName: "emerald",
    cardHeader: "bg-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20",
    border: "border-emerald-400 dark:border-emerald-600",
    bgLight: "bg-emerald-50/70 dark:bg-emerald-950/20",
    textPrimary: "text-emerald-700 dark:text-emerald-300",
    textSecondary: "text-emerald-800 dark:text-emerald-200",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconText: "text-emerald-600 dark:text-emerald-400",
  },
};

export function getRoleTheme(role: string): RoleThemeConfig {
  const normalized = role.toLowerCase();
  if (normalized === "sub_contractor" || normalized === "sub-contractor") {
    return roleThemes.sub_contractor;
  }
  if (normalized === "contractor") {
    return roleThemes.contractor;
  }
  return roleThemes.labour;
}
