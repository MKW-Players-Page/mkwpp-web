import { useContext, useState } from "react";
import { ScoreSubmission } from "../../api";
import { formatDate, formatTime } from "../../utils/Formatters";
import {
  handleBars,
  I18nContext,
  translate,
  translateCategoryName,
  translateTrack,
} from "../../utils/i18n/i18n";
import { getTrackById, MetadataContext } from "../../utils/Metadata";
import Icon from "./Icon";
import ObscuredModule from "./ObscuredModule";
import OverwriteColor from "./OverwriteColor";
import SubmissionForm from "./SubmissionForm";
import Tooltip from "./Tooltip";

import "./SubmissionCard.css";
import PlayerMention from "./PlayerMention";
import { LapModeEnum } from "./LapModeSelect";
import { SettingsContext } from "../../utils/Settings";
import { getCategorySiteHue } from "../../utils/EnumUtils";

export interface SubmissionCardProps {
  submission: ScoreSubmission;
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
        <p>{translateTrack(getTrackById(metadata.tracks, submission.track), lang)}</p>
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
              <Tooltip left={true} text={submission.comment}>
                <Icon icon="Comment" />
              </Tooltip>
            )}
          </div>
          <div>
            {submission.status === "pending" ? (
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
                      deleteId={submission.id}
                      starterPlayer={submission.player.id}
                      starterTrack={submission.track}
                      starterCategory={submission.category}
                      starterLapMode={submission.isLap ? LapModeEnum.Lap : LapModeEnum.Course}
                      starterValue={formatTime(submission.value)}
                      starterDate={submission.date ? formatDate(submission.date) : undefined}
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
                      [["name", <PlayerMention precalcPlayer={submission.submittedBy.player} />]],
                    )}
                  </div>
                  <div>
                    {handleBars(
                      translate("submissionPageMySubmissionsTabTooltipSubmittedFor", lang),
                      [["name", <PlayerMention precalcPlayer={submission.player} />]],
                    )}
                  </div>
                  <div>
                    {handleBars(
                      translate("submissionPageMySubmissionsTabTooltipSubmittedAt", lang),
                      [["time", submission.submittedAt.toLocaleString(lang)]],
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
                  {submission.reviewerNote ? (
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
                          submission.reviewedBy ? (
                            <PlayerMention precalcPlayer={submission.reviewedBy.player} />
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
                          submission.reviewedAt?.toLocaleString(lang) ??
                            translate("submissionPageMySubmissionsTabTooltipNotReviewed", lang),
                        ],
                      ],
                    )}
                  </div>
                </span>
              }
            >
              {submission.status === "accepted" ? (
                <OverwriteColor hue={100} luminosityShift={1} saturationShift={100}>
                  <Icon icon="SubmissionAccepted" />
                </OverwriteColor>
              ) : submission.status === "rejected" ? (
                <OverwriteColor hue={0} luminosityShift={1} saturationShift={100}>
                  <Icon icon="SubmissionRejected" />
                </OverwriteColor>
              ) : submission.status === "pending" || submission.status === "on_hold" ? (
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
