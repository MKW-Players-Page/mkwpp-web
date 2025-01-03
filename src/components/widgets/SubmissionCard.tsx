import { useContext, useState } from "react";
import { ScoreSubmission } from "../../api";
import { formatTime } from "../../utils/Formatters";
import {
  I18nContext,
  translate,
  translateCategoryName,
  translateTrack,
} from "../../utils/i18n/i18n";
import { getTrackById, MetadataContext } from "../../utils/Metadata";
import Icon from "./Icon";
import ObscuredModule from "./ObscuredModule";
import OverwriteColor from "./OverwriteColor";
import SubmitForm from "./SubmitForm";
import Tooltip from "./Tooltip";

export interface SubmissionCardProps {
  submission: ScoreSubmission;
}

const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  const metadata = useContext(MetadataContext);
  const { lang } = useContext(I18nContext);
  const [visibleObscured, setVisibleObscured] = useState(false);
  return (
    <div key={submission.id} className="card">
      <p className="nobr">
        {translateTrack(getTrackById(metadata.tracks, submission.track), lang)}
        ,&nbsp;
        {translateCategoryName(submission.category, lang)},&nbsp;
        {submission.isLap
          ? translate("constantLapModeLap", lang)
          : translate("constantLapModeCourse", lang)}
      </p>
      <p>{formatTime(submission.value)}</p>
      <p>
        <div className="submission-card-flex-div">
          <div>
            {submission.videoLink && (
              <a href={submission.videoLink} target="_blank" rel="noopener noreferrer">
                <Icon icon="Video" />
              </a>
            )}
            {submission.ghostLink && (
              <a href={submission.ghostLink} target="_blank" rel="noopener noreferrer">
                <Icon icon="Ghost" />
              </a>
            )}
            {submission.comment && (
              <Tooltip left={true} text={submission.comment}>
                <Icon icon="Comment" />
              </Tooltip>
            )}
          </div>
          <div>
            {submission.status === "accepted" ? (
              <Icon icon="SubmissionAccepted" />
            ) : submission.status === "rejected" ? (
              <Tooltip text="">
                <Icon icon="SubmissionRejected" />
              </Tooltip>
            ) : submission.status === "pending" ? (
              <>
                <span>
                  <Icon icon="Edit" />
                </span>
                <ObscuredModule stateVisible={visibleObscured} setStateVisible={setVisibleObscured}>
                  <SubmitForm />
                </ObscuredModule>
                <OverwriteColor hue={20} saturationShift={1000}>
                  <Icon icon="SubmissionPending" />
                </OverwriteColor>
              </>
            ) : submission.status === "on_hold" ? (
              <>
                <Icon icon="Edit" />
                <Tooltip text="">
                  <OverwriteColor hue={20} saturationShift={1000}>
                    <Icon icon="SubmissionPending" />
                  </OverwriteColor>
                </Tooltip>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </p>
    </div>
  );
};

export default SubmissionCard;
