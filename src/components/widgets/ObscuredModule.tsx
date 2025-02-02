import { MouseEventHandler, ReactNode } from "react";
import Deferred from "./Deferred";
import "./ObscuredModule.css";

export interface ObscuredModuleProps {
  children: ReactNode;
  stateVisible: boolean;
  setStateVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
}

const ObscuredModule = ({
  children,
  stateVisible,
  setStateVisible,
  onClose,
}: ObscuredModuleProps) => {
  const closeFn: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      setStateVisible(false);
      if (onClose !== undefined) onClose();
    }
  };

  return (
    <div
      onClick={closeFn}
      className={`obscured-module-dark-layer${stateVisible ? " visible" : ""}`}
    >
      <div className="module obscured-module">
        <div className="obscured-module-body">
          <Deferred isWaiting={!stateVisible}>{children}</Deferred>
        </div>
      </div>
      <div onClick={closeFn} className="module obscured-module-close-button">
        Close
      </div>
    </div>
  );
};

export default ObscuredModule;
