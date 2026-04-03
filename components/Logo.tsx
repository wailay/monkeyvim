"use client";

export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="6" fill="var(--mv-bg)" />
      <text
        x="16"
        y="21.5"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="15"
        fontWeight="600"
        letterSpacing="-0.5"
      >
        <tspan fill="var(--mv-secondary)">m</tspan>
        <tspan fill="var(--mv-accent)">v</tspan>
      </text>
    </svg>
  );
}
