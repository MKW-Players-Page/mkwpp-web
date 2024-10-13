export interface MouseFollowProp {
  children: JSX.Element;
  mouseData: MouseFollowState;
}

export interface MouseFollowState {
  x: number;
  y: number;
  show: boolean;
}

const MouseFollow = ({ children, mouseData }: MouseFollowProp) => {
  return (
    <div
      style={
        {
          position: "absolute",
          left: mouseData.x + 25,
          top: mouseData.y + 25,
          display: mouseData.show ? "" : "none",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

export default MouseFollow;
