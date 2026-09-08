import { COLOR } from "../tokens";

/**
 * Icon — the UI / interface icon set from the ASSETS LIBRARY sheet.
 * Single-weight line icons on a 24×24 grid, `currentColor`-style via `color`.
 * Flat, minimal, premium. Use for interface beats, list markers, callouts.
 */
export type IconName =
  | "arrowRight"
  | "arrowUp"
  | "arrowDown"
  | "plus"
  | "circle"
  | "dot"
  | "refresh"
  | "search"
  | "close"
  | "check"
  | "menu"
  | "gear"
  | "person"
  | "warning"
  | "info"
  | "chat";

const P: Record<IconName, React.ReactNode> = {
  arrowRight: <path d="M4 12h15M13 6l6 6-6 6" />,
  arrowUp: <path d="M12 20V5M6 11l6-6 6 6" />,
  arrowDown: <path d="M12 4v15M6 13l6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  circle: <circle cx={12} cy={12} r={8} />,
  dot: <circle cx={12} cy={12} r={5} fill="currentColor" />,
  refresh: <path d="M20 11a8 8 0 1 0-.9 4M20 5v6h-6" />,
  search: (
    <>
      <circle cx={11} cy={11} r={6} />
      <path d="M20 20l-4.5-4.5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 13l4 4L19 7" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  gear: (
    <>
      <circle cx={12} cy={12} r={3} />
      <path d="M12 2.5l1.3 2.2 2.5-.6.3 2.6 2.4 1-.9 2.4 1.6 2-2 1.7.4 2.6-2.6.3-1.1 2.4-2.3-1.2-2.3 1.2-1.1-2.4-2.6-.3.4-2.6-2-1.7 1.6-2-.9-2.4 2.4-1 .3-2.6 2.5.6z" />
    </>
  ),
  person: (
    <>
      <circle cx={12} cy={8} r={3.6} />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v5M12 17.6v.1" />
    </>
  ),
  info: (
    <>
      <circle cx={12} cy={12} r={8} />
      <path d="M12 11v5M12 8.4v.1" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-4 4V5z" />,
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({ name, size = 48, color = COLOR.ink, strokeWidth = 2, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color, ...style }}
  >
    {P[name]}
  </svg>
);
