import { MouseEvent, ReactNode } from "react";
import { IFTAPlacement, trackReferralIFTAClick } from "@/lib/trackReferralIFTA";

type ReferralIFTAButtonProps = {
  children: ReactNode;
  className?: string;
  placement: IFTAPlacement;
};

const ReferralIFTAButton = ({ children, className, placement }: ReferralIFTAButtonProps) => {
  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetUrl = await trackReferralIFTAClick(placement);
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <a href="#" onClick={handleClick} className={className} rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default ReferralIFTAButton;