import { ReactNode } from "react";

import "./Deferred.css";

export interface DeferredProps {
  isWaiting: boolean;
  children?: ReactNode;
}

const Deferred = ({ isWaiting, children }: DeferredProps) => {
  return isWaiting ? (
    <div className="deferred-container">
      <span className="deferred" />
    </div>
  ) : (
    <>{children}</>
  );
};

export default Deferred;
