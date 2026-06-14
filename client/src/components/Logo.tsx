interface LogoProps {
  className?: string;
  size?: number;
}

// Logo: copa abstracta + línia de ruta d'Espanya cap a la final.
export function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-label="LaVermellaFCB al Mundial"
      role="img"
    >
      {/* copa */}
      <path
        d="M14 8h20l-2.2 13.4a9.8 9.8 0 0 1-15.6 0L14 8z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M20 34h8M24 28.5V34" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M19 40h10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      {/* ruta d'Espanya (acent vermell/daurat) */}
      <path
        d="M15 14c3.2 3 6.6 3 9.8 0s6.6-3 9.8 0"
        stroke="hsl(var(--accent))"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="15" cy="14" r="2.4" fill="hsl(var(--primary))" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo size={30} className="text-foreground" />
      <div className="leading-none">
        <span className="block font-display text-base font-bold tracking-tight">
          LaVermellaFCB <span className="grad-text-gold">al Mundial</span>
        </span>
        <span className="block text-[11px] text-muted-foreground tracking-wide">
          Seguiment del Mundial
        </span>
      </div>
    </div>
  );
}
