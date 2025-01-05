import { ReactNode } from "react";
import Deferred from "./Deferred";
import "./ObscuredModule.css";

export interface ObscuredModuleProps {
  children: ReactNode;
  stateVisible: boolean;
  setStateVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setReload?: React.Dispatch<React.SetStateAction<number>>;
}

const ObscuredModule = ({
  children,
  stateVisible,
  setStateVisible,
  setReload,
}: ObscuredModuleProps) => {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setStateVisible(false);
          if (setReload !== undefined) setReload(Math.random());
        }
      }}
      className={`obscured-module-dark-layer${stateVisible ? " visible" : ""}`}
    >
      <div className="module obscured-module">
        <div className="obscured-module-body">
          <Deferred isWaiting={!stateVisible}>{children}</Deferred>
        </div>
      </div>
      <div className="module obscured-module-close-button">Close</div>
    </div>
  );
};

export default ObscuredModule;
