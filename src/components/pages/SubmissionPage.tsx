import { useContext, useState } from "react";

import Deferred from "../widgets/Deferred";
import { Icon, Tab, TabbedModule, Tooltip } from "../widgets";
import api, { CategoryEnum, EditScoreSubmission, Score } from "../../api";
import { MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { Navigate } from "react-router-dom";
import { Pages, resolvePage } from "./Pages";
import { useApi } from "../../hooks";
import { handleBars, I18nContext, translate, translateTrack } from "../../utils/i18n/i18n";
import SubmissionForm from "../widgets/SubmissionForm";
import SubmissionCard from "../widgets/SubmissionCard";
import RadioButtons from "../widgets/RadioButtons";
import { LapModeEnum, LapModeRadio } from "../widgets/LapModeSelect";
import { formatDate, formatTime } from "../../utils/Formatters";
import { Filtering, ScoreDoubled } from "./PlayerProfilePage";
import { CategoryRadio } from "../widgets/CategorySelect";
import OverwriteColor from "../widgets/OverwriteColor";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import { SettingsContext } from "../../utils/Settings";
import ObscuredModule from "../widgets/ObscuredModule";
import PlayerMention from "../widgets/PlayerMention";

const SubmitTab = () => {
  return <SubmissionForm />;
};

enum SubmissionFilter {
  All = 1,
  ByYou = 2,
  ForYou = 3,
}

const SubmissionsTab = () => {
  const metadata = useContext(MetadataContext);
  const { user } = useContext(UserContext);
  const [reload, setReload] = useState(Math.random());
  const [filter, setFilter] = useState<SubmissionFilter>(SubmissionFilter.All);

  const { isLoading, data: submissions } = useApi(
    () => api.timetrialsSubmissionsList(),
    [reload],
    "trackSubmissions",
  );

  return (
    <div className="module-content">
      <RadioButtons
        state={filter}
        setState={setFilter}
        data={[
          { text: "Submitted By You", value: SubmissionFilter.ByYou },
          { text: "Submitted For You", value: SubmissionFilter.ForYou },
          { text: "All your Submissions", value: SubmissionFilter.All },
        ]}
      />
      <Deferred isWaiting={isLoading || metadata.isLoading}>
        <div key={reload} className="card-container">
          {submissions
            ?.filter((submission) =>
              SubmissionFilter.All
                ? true
                : SubmissionFilter.ByYou
                  ? submission.submittedBy.player.id === user?.player
                  : submission.player.id === user?.player,
            )
            .map((submission) => <SubmissionCard setReload={setReload} submission={submission} />)}
        </div>
      </Deferred>
    </div>
  );
};

interface TimesheetTabEditBtnProps {
  score: Score;
  patchUpData?: EditScoreSubmission;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

const TimesheetTabEditBtn = ({ patchUpData, score, setReload }: TimesheetTabEditBtnProps) => {
  const [visibleObscured, setVisibleObscured] = useState(false);
  return (
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
        <ObscuredModule stateVisible={visibleObscured} setStateVisible={setVisibleObscured}>
          <SubmissionForm
            editModeScore={score}
            starterTrack={score.track}
            starterCategory={score.category}
            starterLapMode={score.isLap ? LapModeEnum.Lap : LapModeEnum.Course}
            starterValue={formatTime(score.value)}
            starterDate={
              score.date
                ? `${score.date.getFullYear().toString().padStart(4, "0")}-${(score.date.getMonth() + 1).toString().padStart(2, "0")}-${score.date.getDate().toString().padStart(2, "0")}`
                : undefined
            }
            starterGhostLink={patchUpData?.ghostLink ?? score.ghostLink ?? undefined}
            starterVideoLink={patchUpData?.videoLink ?? score.videoLink ?? undefined}
            starterComment={patchUpData?.comment ?? score.comment ?? undefined}
            starterSubmitterNote={patchUpData?.submitterNote ?? undefined}
            doneFunc={() => {
              setVisibleObscured(false);
              setReload(Math.random());
            }}
          />
        </ObscuredModule>
      </OverwriteColor>
    </>
  );
};

const TimesheetTab = () => {
  const metadata = useContext(MetadataContext);
  const { lang } = useContext(I18nContext);
  const { user } = useContext(UserContext);
  const { settings } = useContext(SettingsContext);

  const [reload, setReload] = useState(Math.random());
  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.NonShortcut);
  const [lapMode, setLapMode] = useState<LapModeEnum>(LapModeEnum.Overall);

  const { isLoading: scoresLoading, data: scores } = useApi(
    () => api.timetrialsPlayersScoresList({ id: user?.player ?? 1, category, region: 1 }),
    [user, category, reload],
    "playerProfileScores",
  );

  const { isLoading: editsLoading, data: edits } = useApi(
    () =>
      api
        .timetrialsSubmissionsEditsList()
        .then((r) => r.sort((a, b) => +b.submittedAt - +a.submittedAt)),
    [reload],
    "playerEdits",
  );

  const sortedScores = scores
    ?.filter(
      lapMode === LapModeEnum.Overall
        ? Filtering.overall
        : lapMode === LapModeEnum.Course
          ? Filtering.courseOnly
          : Filtering.flapOnly,
    )
    .map((score, index, arr) => {
      (score as ScoreDoubled).repeat = score.track === arr[index - 1]?.track;
      (score as ScoreDoubled).precedesRepeat = score.track === arr[index + 1]?.track;
      return score as ScoreDoubled;
    });

  const siteHue = getCategorySiteHue(category, settings);
  return (
    <div key={reload} style={{ padding: "10px" }}>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategoryRadio value={category} onChange={setCategory} />
          <LapModeRadio value={lapMode} onChange={setLapMode} includeOverall />
        </div>
        <Deferred isWaiting={metadata.isLoading || scoresLoading || editsLoading}>
          <table key={reload} className="module">
            <thead>
              <tr>
                <th>{translate("playerProfilePageTrackColumn", lang)}</th>
                {lapMode === LapModeEnum.Overall ? (
                  <>
                    <th>{translate("playerProfilePageCourseTimeColumn", lang)}</th>
                    <th>{translate("playerProfilePageLapTimeColumn", lang)}</th>
                  </>
                ) : (
                  <th>{translate("playerProfilePageTimeColumn", lang)}</th>
                )}
                <th>{translate("playerProfilePageRankColumn", lang)}</th>
                <th>{translate("playerProfilePageDateColumn", lang)}</th>
                <th className="icon-cell" />
                <th className="icon-cell" />
                <th className="icon-cell" />
                <th className="icon-cell" />
                <th className="icon-cell" />
                <th className="icon-cell" />
              </tr>
            </thead>
            <tbody className="table-hover-rows">
              {sortedScores?.map((score) => {
                const track = metadata.tracks?.find((r) => r.id === score.track);
                const submission = edits?.find((x) => x.score.id === score.id);
                return (
                  <tr key={`${score.isLap ? "l" : "c"}${score.track}`}>
                    {score.precedesRepeat ? (
                      <td rowSpan={2}>{translateTrack(track, lang)}</td>
                    ) : score.repeat ? (
                      <></>
                    ) : (
                      <td>{translateTrack(track, lang)}</td>
                    )}
                    {score.isLap && lapMode === LapModeEnum.Overall && <td />}
                    <td className={score?.category !== category ? "fallthrough" : ""}>
                      {formatTime(score.value)}
                    </td>
                    {!score.isLap && lapMode === LapModeEnum.Overall && <td />}
                    <td>{score.rank}</td>
                    <td>{score.date ? formatDate(score.date) : "????-??-??"}</td>
                    <td className="icon-cell">
                      {score.videoLink && (
                        <a href={score.videoLink} target="_blank" rel="noopener noreferrer">
                          <Icon icon="Video" />
                        </a>
                      )}
                    </td>
                    <td className="icon-cell">
                      {score.ghostLink && (
                        <a href={score.ghostLink} target="_blank" rel="noopener noreferrer">
                          <Icon icon="Ghost" />
                        </a>
                      )}
                    </td>
                    <td className="icon-cell">
                      {score.comment && (
                        <Tooltip text={score.comment}>
                          <Icon icon="Comment" />
                        </Tooltip>
                      )}
                    </td>
                    <td className="icon-cell">
                      {submission && (
                        <Tooltip
                          text={
                            <span style={{ whiteSpace: "nowrap" }}>
                              {submission.submitterNote ? (
                                <div style={{ marginBottom: "15px" }}>
                                  {submission.submitterNote}
                                </div>
                              ) : (
                                <></>
                              )}
                              <div>
                                {handleBars(
                                  translate(
                                    "submissionPageMySubmissionsTabTooltipSubmittedAt",
                                    lang,
                                  ),
                                  [["time", submission.submittedAt.toLocaleString(lang)]],
                                )}
                              </div>
                            </span>
                          }
                        >
                          <Icon icon="Note" />
                        </Tooltip>
                      )}
                    </td>
                    <td className="icon-cell">
                      {submission && (
                        <Tooltip
                          text={
                            <span style={{ whiteSpace: "nowrap" }}>
                              {submission.reviewerNote ? (
                                <div style={{ marginBottom: "15px" }}>
                                  {submission.reviewerNote}
                                </div>
                              ) : (
                                <></>
                              )}
                              <div>
                                {handleBars(
                                  translate(
                                    "submissionPageMySubmissionsTabTooltipReviewedBy",
                                    lang,
                                  ),
                                  [
                                    [
                                      "name",
                                      submission.reviewedBy ? (
                                        <PlayerMention
                                          precalcPlayer={submission.reviewedBy.player}
                                        />
                                      ) : (
                                        translate(
                                          "submissionPageMySubmissionsTabTooltipNotReviewed",
                                          lang,
                                        )
                                      ),
                                    ],
                                  ],
                                )}
                              </div>
                              <div>
                                {handleBars(
                                  translate(
                                    "submissionPageMySubmissionsTabTooltipReviewedAt",
                                    lang,
                                  ),
                                  [
                                    [
                                      "time",
                                      submission.reviewedAt?.toLocaleString(lang) ??
                                        translate(
                                          "submissionPageMySubmissionsTabTooltipNotReviewed",
                                          lang,
                                        ),
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
                      )}
                    </td>
                    <td className="icon-cell">
                      <TimesheetTabEditBtn
                        setReload={setReload}
                        score={score}
                        patchUpData={
                          submission?.status === "pending" || submission?.status === "on_hold"
                            ? submission
                            : undefined
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Deferred>
      </OverwriteColor>
    </div>
  );
};

const SubmissionPage = () => {
  const { isLoading, user } = useContext(UserContext);
  const { lang } = useContext(I18nContext);

  return (
    <>
      <Deferred isWaiting={isLoading}>
        {!user && <Navigate to={resolvePage(Pages.UserLogin)} />}
        <h1>{translate("submissionPageTabbedModuleHeading", lang)}</h1>
        <TabbedModule>
          <Tab title={translate("submissionPageSubmitTabTitle", lang)} element={<SubmitTab />} />
          <Tab
            title={translate("submissionPageSubmissionsTabTitle", lang)}
            element={<SubmissionsTab />}
          />
          <Tab
            title={translate("submissionPageTimesheetTabTitle", lang)}
            element={<TimesheetTab />}
          />
        </TabbedModule>
      </Deferred>
    </>
  );
};

export default SubmissionPage;
