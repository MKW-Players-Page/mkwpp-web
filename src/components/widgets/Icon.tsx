import { Region } from "../../api";
import "./Icon.css";

import { ReactComponent as CommentIcon } from "./icons/comment.svg";
import { ReactComponent as GhostIcon } from "./icons/ghost.svg";
import { ReactComponent as VideoIcon } from "./icons/video.svg";

export const Icons = {
  Comment: CommentIcon,
  Ghost: GhostIcon,
  Video: VideoIcon,
};

export interface IconProps {
  icon: keyof typeof Icons;
}

const Icon = ({ icon }: IconProps) => {
  const IconElement = Icons[icon];

  return (
    <span className="icon">
      <IconElement />
    </span>
  );
};

export interface FlagIconProps {
  region?: Region;
}

export const FlagIcon = ({ region }: FlagIconProps) => {
  return (
    <span className="flag-icon">
      {region && <img src={`/mkw/flags/${region.code.toLowerCase()}.svg`} alt={region.name} />}
    </span>
  );
};

export default Icon;
