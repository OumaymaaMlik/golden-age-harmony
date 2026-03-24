import logoDark from "@/assets/nutriwell-logo.png";

interface NutriwellLogoProps {
  variant?: "dark" | "white";
  className?: string;
}

const NutriwellLogo = ({ variant = "dark", className = "" }: NutriwellLogoProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoDark}
        alt="Nutriwell™"
        className="h-9"
        style={variant === "white" ? { filter: "brightness(0) invert(1)" } : undefined}
      />
    </div>
  );
};

export default NutriwellLogo;
