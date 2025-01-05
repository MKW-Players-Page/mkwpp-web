export interface OverwriteColorProp {
  children: JSX.Element | JSX.Element[];
  hue?: number;
  saturationShift?: number;
  luminosityShift?: number;
}

const OverwriteColor = ({
  hue,
  saturationShift,
  luminosityShift,
  children,
}: OverwriteColorProp) => {
  let outStyle: any = {};
  if (hue !== undefined) outStyle["--site-hue"] = hue;
  if (saturationShift !== undefined) outStyle["--saturation-shift"] = saturationShift;
  if (luminosityShift !== undefined) outStyle["--luminosity-shift"] = luminosityShift;
  return (
    <span className="overwrite-color" style={outStyle}>
      {children}
    </span>
  );
};

export default OverwriteColor;
