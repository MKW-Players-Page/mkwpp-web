import { ReactNode } from "react";

import "./Tooltip.css";

export interface TooltipProps {
  children?: ReactNode;
  text: string;
  left?: boolean;
}

const Tooltip = ({ children, text, left }: TooltipProps) => {
  return (
    <div className="tooltip">
      {children}
      <span className={`tooltip-text${left ? ` left` : ""}`}>{text}</span>
    </div>
  );
};

export default Tooltip;
