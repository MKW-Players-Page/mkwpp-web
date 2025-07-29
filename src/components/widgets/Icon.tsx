import "./Icon.css";
import Flag from "./Flags";
import { Flags } from "./Flags";

import CommentIcon from "../../assets/icons/comment.svg?react";
import GhostIcon from "../../assets/icons/ghost.svg?react";
import VideoIcon from "../../assets/icons/video.svg?react";
import DropdownCaret from "../../assets/icons/dropdowncaret.svg?react";
import CaretUpsideDown from "../../assets/icons/caretupsidedown.svg?react";
import HamburgerIcon from "../../assets/icons/hamburger.svg?react";
import EditIcon from "../../assets/icons/edit.svg?react";
import SubmissionAcceptedIcon from "../../assets/icons/submissionAccepted.svg?react";
import SubmissionPendingIcon from "../../assets/icons/submissionPending.svg?react";
import SubmissionRejectedIcon from "../../assets/icons/submissionRejected.svg?react";
import NoteIcon from "../../assets/icons/note.svg?react";
import DeleteIcon from "../../assets/icons/delete.svg?react";
import VisibleIcon from "../../assets/icons/visible.svg?react";
import InvisibleIcon from "../../assets/icons/invisible.svg?react";
import { useContext } from "react";
import { SettingsContext } from "../../utils/Settings";
import { MetadataContext } from "../../utils/Metadata";
import { Region, RegionType } from "../../api";

export const Icons = {
  Comment: CommentIcon,
  Ghost: GhostIcon,
  Video: VideoIcon,
  Caret: DropdownCaret,
  UpsideDownCaret: CaretUpsideDown,
  Hamburger: HamburgerIcon,
  Edit: EditIcon,
  SubmissionAccepted: SubmissionAcceptedIcon,
  SubmissionPending: SubmissionPendingIcon,
  SubmissionRejected: SubmissionRejectedIcon,
  Note: NoteIcon,
  Delete: DeleteIcon,
  Visible: VisibleIcon,
  Invisible: InvisibleIcon,
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
  region?: Region | keyof typeof Flags;
  width?: number;
  showRegFlagRegardless?: boolean;
}

export const FlagIcon = ({ region, showRegFlagRegardless, width }: FlagIconProps) => {
  const { settings } = useContext(SettingsContext);
  const metadata = useContext(MetadataContext);

  const getFirstValidRegion = (region: Region): Region => {
    if (
      region.parentId === undefined ||
      region.parentId === null ||
      region.regionType === RegionType.Country ||
      region.regionType === RegionType.CountryGroup ||
      region.regionType === RegionType.Continent ||
      region.regionType === RegionType.World
    )
      return region;
    return getFirstValidRegion(metadata.getRegionById(region.parentId) ?? Region.worldDefault());
  };

  const computeRegionCode =
    region === undefined
      ? "xx"
      : typeof region === "string"
        ? region
        : settings.showRegFlags || showRegFlagRegardless
          ? region.code.toLowerCase()
          : getFirstValidRegion(region).code.toLowerCase();

  return (
    <span className="flag-icon" style={{ width: `${width ?? 24}px` }}>
      <Flag flag={computeRegionCode as keyof typeof Flags} />
    </span>
  );
};

export default Icon;
