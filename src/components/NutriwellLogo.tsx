interface NutriwellLogoProps {
  variant?: "dark" | "white";
  className?: string;
}

const NutriwellLogo = ({ variant = "dark", className = "" }: NutriwellLogoProps) => {
  const textColor = variant === "white" ? "#FFFFFF" : "#0A0A0A";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Heart icon with gradient */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`heartGrad-${variant}`} x1="0" y1="0" x2="36" y2="36">
            <stop offset="0%" stopColor="#00BF63" />
            <stop offset="100%" stopColor="#00C6FE" />
          </linearGradient>
        </defs>
        <path
          d="M18 32C18 32 3 22 3 12C3 7 7 3 12 3C14.5 3 16.8 4.2 18 6C19.2 4.2 21.5 3 24 3C29 3 33 7 33 12C33 22 18 32 18 32Z"
          fill={`url(#heartGrad-${variant})`}
          opacity="0.9"
        />
        <path
          d="M12 17L16 21L25 12"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <span className="text-xl font-bold tracking-tight" style={{ color: textColor }}>
        Nutriwell<sup className="text-xs ml-0.5">™</sup>
      </span>
    </div>
  );
};

export default NutriwellLogo;
