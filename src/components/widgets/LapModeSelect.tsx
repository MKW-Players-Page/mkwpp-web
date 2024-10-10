export enum LapModeEnum {
  Course = "course",
  Lap = "lap",
  Overall = "overall",
}

export interface LapModeSelectProps {
  /** Whether to include Overall as an option. Defaults to false if not defined. */
  includeOverall?: boolean;
  /** The currently selected option. If included, the value for Overall is `undefined`. */
  value: LapModeEnum;
  /** Callback to invoke when user attempts to select a new lap mode */
  onChange: (lapMode: LapModeEnum) => void;
}

const LapModeSelect = ({ includeOverall, value, onChange }: LapModeSelectProps) => {
  const options = [
    ...(includeOverall ? [LapModeEnum.Overall] : []),
    LapModeEnum.Course,
    LapModeEnum.Lap,
  ];

  return (
    <select
      className="module filter-select"
      value={value}
      onChange={(e) => onChange(e.target.value as LapModeEnum)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {Object.keys(LapModeEnum)[Object.values(LapModeEnum).indexOf(option)]}
        </option>
      ))}
    </select>
  );
};

export default LapModeSelect;
