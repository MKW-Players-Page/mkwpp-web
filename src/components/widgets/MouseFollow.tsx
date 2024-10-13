import { useState } from "react";

export interface MouseFollowProp {
  children: JSX.Element;
}

export interface MouseFollowState {
  x: number;
  y: number;
  show: boolean;
}

const MouseFollow = ({ children }: MouseFollowProp) => {
  const [mouseData, setMouseData] = useState<MouseFollowState>({ x: 0, y: 0, show: false });
  return (
    <div
      style={{ position: "absolute", left: mouseData.x, top: mouseData.y } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default MouseFollow;
