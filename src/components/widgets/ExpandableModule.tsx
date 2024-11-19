import Icon from "./Icon";
import "./ExpandableModule.css";
import { useState } from "react";

export interface ExpandableModuleProps {
  heading: string;
  defaultExpanded?: boolean;
  style?: React.CSSProperties;
  children: JSX.Element;
}

const ExpandableModule = ({ children, defaultExpanded, heading, style }: ExpandableModuleProps) => {
  const [expanded, setExpanded] = useState(!!defaultExpanded);

  return (
    <div className="module expandable-module" style={style}>
      <div onClick={() => setExpanded(!expanded)} className="expandable-module-heading">
        <span>{heading}</span>
        <Icon icon="Caret" />
      </div>
      <div className={`expandable-module-body${expanded ? " expanded" : ""}`}>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ExpandableModule;
