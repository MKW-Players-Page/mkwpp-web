import { CategoryEnum } from '../../api';
import { getCategoryName } from '../../utils/EnumUtils';

export interface LapModeSelectProps {
  /** Whether to include Overall as an option. Defaults to false if not defined. */
  includeOverall?: boolean;
  /** The currently selected option. If included, the value for Overall is `undefined`. */
  value?: boolean;
  /** Callback to invoke when user attempts to select a new lap mode */
  onChange: (isLap: boolean | undefined) => void;
};

const stringToLapMode = (value: string) => {
  switch (value) {
    case 'undefined': return undefined;
    case 'true': return true;
    case 'false':
    default:
      return false;
  }
}

const getLapModeName = (mode?: boolean) => {
  if (mode === undefined) {
    return "Overall";
  } else if (mode) {
    return "Lap";
  } else {
    return "Course";
  }
};

const LapModeSelect = ({ includeOverall, value, onChange }: LapModeSelectProps) => {
  const options = [
    ...(includeOverall ? ['undefined'] : []),
    'false',
    'true',
  ];

  return (
    <select value={String(value)} onChange={(e) => onChange(stringToLapMode(e.target.value))}>
      {options.map((option) => (
        <option key={option} value={option}>
          {getLapModeName(stringToLapMode(option))}
        </option>
      ))}
    </select>
  );
};

export default LapModeSelect;
