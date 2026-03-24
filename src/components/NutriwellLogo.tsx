import nutriwellLogo from "@/assets/nutriwell-logo.svg";

interface NutriwellLogoProps {
  variant?: "dark" | "white";
  className?: string;
}

const NutriwellLogo = ({ className = "" }: NutriwellLogoProps) => {
  return (
    <img
      src={nutriwellLogo}
      alt="Nutriwell™"
      className={`h-9 w-auto ${className}`}
    />
  );
};

export default NutriwellLogo;
