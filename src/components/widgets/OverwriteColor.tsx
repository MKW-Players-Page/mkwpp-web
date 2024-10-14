export interface OverwriteColorProp {
  children: JSX.Element | JSX.Element[];
  hue: number;
}

const OverwriteColor = ({ hue, children }: OverwriteColorProp) => {
  return (
    <div className="overwrite-color" style={{ "--site-hue": hue } as React.CSSProperties}>
      {children}
    </div>
  );
};

export default OverwriteColor;
