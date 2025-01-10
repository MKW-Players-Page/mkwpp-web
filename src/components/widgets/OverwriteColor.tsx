export interface OverwriteColorProp {
  children: JSX.Element | JSX.Element[];
  hue?: number;
  saturationShift?: number;
  luminosityShift?: number;
  className?: string;
}

const OverwriteColor = ({
  hue,
  saturationShift,
  luminosityShift,
  children,
  className,
}: OverwriteColorProp) => {
  let outStyle: any = {};
  if (hue !== undefined) outStyle["--site-hue"] = hue;
  if (saturationShift !== undefined) outStyle["--saturation-shift"] = saturationShift;
  if (luminosityShift !== undefined) outStyle["--luminosity-shift"] = luminosityShift;
  return (
    <span className={`overwrite-color${className ? " " + className : ""}`} style={outStyle}>
      {children}
    </span>
  );
};

export default OverwriteColor;
