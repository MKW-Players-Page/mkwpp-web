export interface MouseFollowProp {
  children: JSX.Element[];
  className: string;
  style: React.CSSProperties;
  posX: number;
  posY: number;
  show: boolean;
}

const MouseFollow = ({ children, style, posX, posY, show, className }: MouseFollowProp) => {
  style.display = show ? style.display : "none";
  style.position = "absolute";
  style.left = posX;
  style.top = posY;
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export default MouseFollow;
