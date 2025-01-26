import { Region } from "../../api";
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
import { useContext } from "react";
import { SettingsContext } from "../../utils/Settings";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { WorldRegion } from "../../utils/Defaults";

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
      region.parent === undefined ||
      region.parent === null ||
      region.type === "country" ||
      region.type === "country_group" ||
      region.type === "continent" ||
      region.type === "world"
    )
      return region;
    return getFirstValidRegion(getRegionById(metadata, region.parent) ?? WorldRegion);
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
