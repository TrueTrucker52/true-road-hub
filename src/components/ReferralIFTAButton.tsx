import { MouseEvent, ReactNode } from "react";
import { trackReferralIFTAClick } from "@/lib/trackReferralIFTA";

type ReferralIFTAButtonProps = {
  children: ReactNode;
  className?: string;
};

const ReferralIFTAButton = ({ children, className }: ReferralIFTAButtonProps) => {
  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetUrl = await trackReferralIFTAClick();
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <a href="#" onClick={handleClick} className={className} rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default ReferralIFTAButton;