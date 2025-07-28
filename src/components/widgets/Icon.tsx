import "./Icon.css";
import Flag from "./Flags";
import { Flags } from "./Flags";

import { ReactComponent as CommentIcon } from "../../assets/icons/comment.svg";
import { ReactComponent as GhostIcon } from "../../assets/icons/ghost.svg";
import { ReactComponent as VideoIcon } from "../../assets/icons/video.svg";
import { ReactComponent as DropdownCaret } from "../../assets/icons/dropdowncaret.svg";
import { ReactComponent as CaretUpsideDown } from "../../assets/icons/caretupsidedown.svg";
import { ReactComponent as HamburgerIcon } from "../../assets/icons/hamburger.svg";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as SubmissionAcceptedIcon } from "../../assets/icons/submissionAccepted.svg";
import { ReactComponent as SubmissionPendingIcon } from "../../assets/icons/submissionPending.svg";
import { ReactComponent as SubmissionRejectedIcon } from "../../assets/icons/submissionRejected.svg";
import { ReactComponent as NoteIcon } from "../../assets/icons/note.svg";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete.svg";
import { ReactComponent as VisibleIcon } from "../../assets/icons/visible.svg";
import { ReactComponent as InvisibleIcon } from "../../assets/icons/invisible.svg";
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
