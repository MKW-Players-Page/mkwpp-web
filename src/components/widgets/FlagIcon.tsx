import { Region } from '../../api';
import './FlagIcon.css';

export interface FlagIconProps {
  region?: Region;
}

const FlagIcon = ({ region }: FlagIconProps) => {
  return (
    <span className="flag-icon">
      {region && <img src={`/mkw/flags/${region.code.toLowerCase()}.svg`} alt={region.name} />}
    </span>
  )
};

export default FlagIcon;
