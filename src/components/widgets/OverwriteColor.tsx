export interface OverwriteColorProp {
  children: React.ReactNode;
  hue?: number;
  saturationShift?: number;
  luminosityShift?: number;
  className?: string;
  key?: string;
}

const OverwriteColor = ({
  hue,
  saturationShift,
  luminosityShift,
  children,
  className,
  key,
}: OverwriteColorProp) => {
  let outStyle: any = {};
  if (hue !== undefined) outStyle["--site-hue"] = hue;
  if (saturationShift !== undefined) outStyle["--saturation-shift"] = saturationShift;
  if (luminosityShift !== undefined) outStyle["--luminosity-shift"] = luminosityShift;
  return (
    <span
      key={key}
      className={`overwrite-color${className ? " " + className : ""}`}
      style={outStyle}
    >
      {children}
    </span>
  );
};

export default OverwriteColor;
