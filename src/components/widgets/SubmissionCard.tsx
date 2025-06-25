import { useContext, useState } from "react";
import { formatDate, formatTime } from "../../utils/Formatters";
import {
  handleBars,
  I18nContext,
  translate,
  translateCategoryName,
  translateTrack,
} from "../../utils/i18n/i18n";
import { MetadataContext } from "../../utils/Metadata";
import Icon from "./Icon";
import ObscuredModule from "./ObscuredModule";
import OverwriteColor from "./OverwriteColor";
import SubmissionForm from "./SubmissionForm";
import Tooltip from "./Tooltip";

import "./SubmissionCard.css";
import PlayerMention from "./PlayerMention";
import { LapModeEnum, Submission, SubmissionStatus } from "../../api";
import { SettingsContext } from "../../utils/Settings";
import { getCategorySiteHue } from "../../utils/EnumUtils";

export interface SubmissionCardProps {
  submission: Submission;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

const SubmissionCard = ({ submission, setReload }: SubmissionCardProps) => {
  const metadata = useContext(MetadataContext);
  const { lang } = useContext(I18nContext);
  const [visibleObscured, setVisibleObscured] = useState(false);
  const { settings } = useContext(SettingsContext);

  const siteHue = getCategorySiteHue(submission.category, settings);

  return (
    <OverwriteColor hue={siteHue} className="outer-card-div">
      <div key={submission.id} className="card">
        <p>{translateTrack(metadata.getTrackById(submission.trackId), lang)}</p>
        <p>{translateCategoryName(submission.category, lang)}</p>
        <p>
          {submission.isLap
            ? translate("constantLapModeLap", lang)
            : translate("constantLapModeCourse", lang)}
        </p>
        <p>{formatTime(submission.value)}</p>
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
              <Tooltip left text={submission.comment}>
                <Icon icon="Comment" />
              </Tooltip>
            )}
          </div>
          <div>
            {submission.status !== SubmissionStatus.Accepted ? (
              <>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setVisibleObscured(true);
                  }}
                >
                  <Icon icon="Edit" />
                </span>
                <OverwriteColor hue={216}>
                  <ObscuredModule
                    onClose={() => setReload(Math.random())}
                    stateVisible={visibleObscured}
                    setStateVisible={setVisibleObscured}
                  >
                    <SubmissionForm
                      submissionId={submission.id}
                      starterPlayer={submission.playerId}
                      starterTrack={submission.trackId}
                      starterCategory={submission.category}
                      starterLapMode={submission.isLap ? LapModeEnum.Lap : LapModeEnum.Course}
                      starterValue={formatTime(submission.value)}
                      starterDate={formatDate(new Date(submission.date * 1000))}
                      starterGhostLink={submission.ghostLink ?? undefined}
                      starterVideoLink={submission.videoLink ?? undefined}
                      starterComment={submission.comment ?? undefined}
                      starterSubmitterNote={submission.submitterNote ?? undefined}
                      onSuccess={() => {
                        setVisibleObscured(false);
                        setReload(Math.random());
                      }}
                    />
                  </ObscuredModule>
                </OverwriteColor>
              </>
            ) : (
              <></>
            )}
            <Tooltip
              text={
                <span style={{ whiteSpace: "nowrap" }}>
                  {submission.submitterNote ? (
                    <div style={{ marginBottom: "15px" }}>{submission.submitterNote}</div>
                  ) : (
                    <></>
                  )}
                  <div>
                    {handleBars(
                      translate("submissionPageMySubmissionsTabTooltipSubmittedBy", lang),
                      [["name", <PlayerMention playerOrId={submission.submitterId} />]],
                    )}
                  </div>
                  <div>
                    {handleBars(
                      translate("submissionPageMySubmissionsTabTooltipSubmittedFor", lang),
                      [["name", <PlayerMention playerOrId={submission.playerId} />]],
                    )}
                  </div>
                  <div>
                    {handleBars(
                      translate("submissionPageMySubmissionsTabTooltipSubmittedAt", lang),
                      [["time", submission.submittedAt]],
                    )}
                  </div>
                </span>
              }
            >
              <Icon icon="Note" />
            </Tooltip>
            <Tooltip
              text={
                <span style={{ whiteSpace: "nowrap" }}>
                  {submission.reviewerNote !== "" &&
                  submission.reviewerNote !== null &&
                  submission.reviewerNote !== undefined ? (
                    <div style={{ marginBottom: "15px" }}>{submission.reviewerNote}</div>
                  ) : (
                    <></>
                  )}
                  <div>
                    {handleBars(
                      translate("submissionPageMySubmissionsTabTooltipReviewedBy", lang),
                      [
                        [
                          "name",
                          submission.reviewerId !== undefined && submission.reviewerId !== null ? (
                            <PlayerMention playerOrId={submission.reviewerId} />
                          ) : (
                            translate("submissionPageMySubmissionsTabTooltipNotReviewed", lang)
                          ),
                        ],
                      ],
                    )}
                  </div>
                  <div>
                    {handleBars(
                      translate("submissionPageMySubmissionsTabTooltipReviewedAt", lang),
                      [
                        [
                          "time",
                          submission.reviewedAt ??
                            translate("submissionPageMySubmissionsTabTooltipNotReviewed", lang),
                        ],
                      ],
                    )}
                  </div>
                </span>
              }
            >
              {submission.status === SubmissionStatus.Accepted ? (
                <OverwriteColor hue={100} luminosityShift={1} saturationShift={100}>
                  <Icon icon="SubmissionAccepted" />
                </OverwriteColor>
              ) : submission.status === SubmissionStatus.Rejected ? (
                <OverwriteColor hue={0} luminosityShift={1} saturationShift={100}>
                  <Icon icon="SubmissionRejected" />
                </OverwriteColor>
              ) : submission.status === SubmissionStatus.Pending ||
                submission.status === SubmissionStatus.OnHold ? (
                <OverwriteColor hue={20} luminosityShift={1} saturationShift={100}>
                  <Icon icon="SubmissionPending" />
                </OverwriteColor>
              ) : (
                <></>
              )}
            </Tooltip>
          </div>
        </div>
      </div>
    </OverwriteColor>
  );
};

export default SubmissionCard;
