import { useContext, useRef, useState } from "react";
import init, { read_rksys, RKG } from "mkw_lib";

import Deferred from "../widgets/Deferred";
import { Icon, Tab, TabbedModule } from "../widgets";
import {
  Score,
  Track,
  User,
  CategoryEnum,
  LapModeEnum,
  EditSubmission,
  Timesheet,
  Time,
  SubmissionStatus,
} from "../../api";
import { MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Pages, resolvePage } from "./Pages";
import { useApi } from "../../hooks";
import { handleBars, I18nContext, translate, translateTrack } from "../../utils/i18n/i18n";
import SubmissionForm from "../widgets/SubmissionForm";
import SubmissionCard from "../widgets/SubmissionCard";
import { LapModeRadio } from "../widgets/LapModeSelect";
import { formatDate, formatTime } from "../../utils/Formatters";
import { CategoryRadio } from "../widgets/CategorySelect";
import OverwriteColor from "../widgets/OverwriteColor";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import { SettingsContext } from "../../utils/Settings";
import ObscuredModule from "../widgets/ObscuredModule";
import PlayerMention from "../widgets/PlayerMention";
import ArrayTable, { ArrayTableCellData } from "../widgets/Table";
import { SmallBigDateFormat, SmallBigTrackFormat } from "../widgets/SmallBigFormat";
import { secondsToDate } from "../../utils/DateUtils";
import { Box, Switch, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";

const SubmitTab = () => {
  const { lang } = useContext(I18nContext);
  return <SubmissionForm disclaimerText={translate("submissionPageSubmitTabWarning1", lang)} />;
};

interface RKGExportedTime {
  tempId: number;
  track: Track;
  time: number;
  date: Date;
}

interface BulkSubmitEditBtnProps {
  data: RKGExportedTime;
  deleteFunc: () => void;
}

const BulkSubmitEditBtn = ({ data, deleteFunc }: BulkSubmitEditBtnProps) => {
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
            starterTrack={data.track.id}
            starterValue={data.time}
            starterDate={data.date}
            onSuccess={() => {
              setVisibleObscured(false);
              deleteFunc();
            }}
          />
        </ObscuredModule>
      </OverwriteColor>
    </>
  );
};

const BulkSubmitTab = () => {
  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);

  // technically unsafe but, be real
  const ids = useRef(0);

  const [bitMapLicenses, setLicenseBitmap] = useState(0b0000);

  const [times, setTimes] = useState<RKGExportedTime[]>([]);
  const rows: ArrayTableCellData[][] = times.map((time) => {
    const deleteFunc = () => {
      setTimes((prev) => prev.filter((oldTime) => time.tempId !== oldTime.tempId));
    };

    return [
      {
        content: (
          <SmallBigTrackFormat
            track={time.track}
            bigClass="submission-page-bulk-submit-table-b1"
            smallClass="submission-page-bulk-submit-table-s1"
          />
        ),
      },
      {
        content: formatTime(time.time),
      },
      {
        content: (
          <SmallBigDateFormat
            date={time.date}
            bigClass="submission-page-bulk-submit-table-b1"
            smallClass="submission-page-bulk-submit-table-s1"
          />
        ),
      },
      {
        content: <BulkSubmitEditBtn data={time} deleteFunc={deleteFunc} />,
      },
      {
        content: (
          <span style={{ cursor: "pointer" }} onClick={deleteFunc}>
            <Icon icon="Delete" />
          </span>
        ),
      },
    ];
  });

  return (
    <Deferred isWaiting={metadata.isLoading}>
      <div className="module-content">
        <OverwriteColor hue={170}>
          <div style={{ padding: "5px" }} className="module">
            {translate("submissionPageBulkSubmitTabHowTo", lang)}
          </div>
        </OverwriteColor>
        <div className="module-row wrap" style={{ marginBottom: "16px" }}>
          {[
            [1, 0b0001],
            [2, 0b0010],
            [3, 0b0100],
            [4, 0b1000],
          ].map(([number, bitmask]) => (
            <Box>
              <p>
                {handleBars(translate("submissionPageBulkSubmitTabLicence", lang), [
                  ["number", number],
                ])}
              </p>
              <Switch
                onChange={(_, c) =>
                  setLicenseBitmap((prev) => (c ? prev | bitmask : prev & ~bitmask))
                }
              />
            </Box>
          ))}
        </div>
        <div
          style={{ marginBottom: "16px" }}
          onClick={() => {
            const actualUpload = document.createElement("input");
            actualUpload.type = "file";
            actualUpload.style.display = "hidden";
            actualUpload.accept = ".dat";
            document.getElementById("root")?.appendChild(actualUpload);
            actualUpload.click();
            actualUpload.addEventListener("change", async () => {
              const wasm = init().then(async () => {
                if (!actualUpload.files) return;

                try {
                  const arr = new Uint8Array(await actualUpload.files[0].arrayBuffer());

                  const data = read_rksys(arr, bitMapLicenses);

                  const newTimes: RKGExportedTime[] = data.map((readTime: RKG) => {
                    const { time, track, year, month, day } = readTime;
                    readTime.free();

                    ids.current++;

                    return {
                      tempId: ids.current,
                      time,
                      track: metadata.getTrackById(track + 1) as Track,
                      date: new Date(
                        `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
                      ),
                    };
                  });

                  setTimes((prev) => [...prev, ...newTimes]);
                } catch (e) {
                  console.error("wasm error:", e);
                }
              });

              await wasm;
            });
            document.getElementById("root")?.removeChild(actualUpload);
          }}
          className="submit-style"
        >
          {translate("submissionPageSubmitTabUploadRKSYSBtn", lang)}
        </div>
        <ArrayTable
          headerRows={[
            [
              { content: translate("submissionPageBulkSubmitTabTrackCol", lang) },
              { content: translate("submissionPageBulkSubmitTabDateCol", lang) },
              { content: translate("submissionPageBulkSubmitTabTimeCol", lang) },
              { content: null },
              { content: null },
            ],
          ]}
          rows={rows}
          tableData={{ iconCellColumns: [-1, -2] }}
        />
      </div>
    </Deferred>
  );
};

enum SubmissionFilter {
  All = 1,
  ByYou = 2,
  ForYou = 3,
}

const SubmissionsTab = () => {
  const metadata = useContext(MetadataContext);
  const { user } = useContext(UserContext);
  const { lang } = useContext(I18nContext);
  const [reload, setReload] = useState(Math.random());
  const [filter, setFilter] = useState<SubmissionFilter>(SubmissionFilter.All);

  const { isLoading, data: submissions } = useApi(
    () => User.getUserSubmissionsList(user?.userId ?? 0),
    [reload],
    "trackSubmissions",
  );

  return (
    <div className="module-content">
      <ToggleButtonGroup
        value={filter}
        onChange={(_, v) => {
          if (v !== null) setFilter(v);
        }}
        exclusive
        fullWidth
      >
        <ToggleButton value={SubmissionFilter.ByYou}>
          {translate("submissionPageMySubmissionsTabFilterByYou", lang)}
        </ToggleButton>
        <ToggleButton value={SubmissionFilter.ForYou}>
          {translate("submissionPageMySubmissionsTabFilterForYou", lang)}
        </ToggleButton>
        <ToggleButton value={SubmissionFilter.All}>
          {translate("submissionPageMySubmissionsTabFilterAll", lang)}
        </ToggleButton>
      </ToggleButtonGroup>
      <Deferred isWaiting={isLoading || metadata.isLoading}>
        <div key={reload} className="card-container">
          {submissions
            ?.filter((submission) =>
              filter === SubmissionFilter.All
                ? true
                : filter === SubmissionFilter.ByYou
                  ? submission.submitterId === user?.playerId
                  : submission.playerId === user?.playerId,
            )
            .map((submission) => <SubmissionCard setReload={setReload} submission={submission} />)}
        </div>
      </Deferred>
    </div>
  );
};

interface TimesheetTabEditBtnProps {
  score: Score;
  patchUpData?: EditSubmission;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

const TimesheetTabEditBtn = ({ patchUpData, score, setReload }: TimesheetTabEditBtnProps) => {
  const [visibleObscured, setVisibleObscured] = useState(false);
  const { lang } = useContext(I18nContext);

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
        <ObscuredModule
          onClose={() => setReload(Math.random())}
          stateVisible={visibleObscured}
          setStateVisible={setVisibleObscured}
        >
          <SubmissionForm
            editModeScore={score}
            starterTrack={score.trackId}
            starterCategory={score.category}
            starterLapMode={score.isLap ? LapModeEnum.Lap : LapModeEnum.Course}
            starterValue={score.value}
            starterDate={secondsToDate(score.date)}
            submissionId={patchUpData?.id}
            starterGhostLink={patchUpData?.ghostLink ?? score.ghostLink}
            starterVideoLink={patchUpData?.videoLink ?? score.videoLink}
            starterComment={patchUpData?.comment ?? score.comment}
            starterSubmitterNote={patchUpData?.submitterNote}
            onSuccess={() => {
              setVisibleObscured(false);
              setReload(Math.random());
            }}
            disclaimerText={translate("submissionPageSubmitTabWarning2", lang)}
          />
        </ObscuredModule>
      </OverwriteColor>
    </>
  );
};

interface ScoreDoubled extends Score {
  precedesRepeat: boolean;
  repeat: boolean;
}

const Filtering = {
  flapOnly: (a: Time) => a.isLap,
  courseOnly: (a: Time) => !a.isLap,
  overall: (a: Time) => true,
};

const TimesheetTab = () => {
  const metadata = useContext(MetadataContext);
  const { lang } = useContext(I18nContext);
  const { user } = useContext(UserContext);
  const { settings } = useContext(SettingsContext);

  const [reload, setReload] = useState(Math.random());
  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.NonShortcut);
  const [lapMode, setLapMode] = useState<LapModeEnum>(LapModeEnum.Overall);

  const { isLoading: scoresLoading, data: timesheet } = useApi<Timesheet>(
    () => Timesheet.get(user?.playerId ?? 0, category),
    [user, category, reload],
    "playerProfileScores",
  );

  const { isLoading: editsLoading, data: edits } = useApi(
    () =>
      User.getUserEditSubmissionsList(user?.userId ?? 0).then((r) =>
        r?.sort((a, b) => +b.submittedAt - +a.submittedAt),
      ),
    [reload],
    "playerEdits",
  );

  const sortedScores = timesheet?.times
    ?.filter(
      lapMode === LapModeEnum.Overall
        ? Filtering.overall
        : lapMode === LapModeEnum.Course
          ? Filtering.courseOnly
          : Filtering.flapOnly,
    )
    .map((score, index, arr) => {
      (score as ScoreDoubled).repeat = score.trackId === arr[index - 1]?.trackId;
      (score as ScoreDoubled).precedesRepeat = score.trackId === arr[index + 1]?.trackId;
      return score as ScoreDoubled;
    });

  const siteHue = getCategorySiteHue(category, settings);
  return (
    <div key={reload} style={{ padding: "10px" }}>
      <OverwriteColor hue={siteHue}>
        <div className="module-row wrap">
          <CategoryRadio value={category} onChange={setCategory} />
          <LapModeRadio value={lapMode} onChange={setLapMode} includeOverall />
        </div>
        <Deferred isWaiting={metadata.isLoading || scoresLoading || editsLoading}>
          <div className="module">
            <table key={reload}>
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
                  const track = metadata.tracks?.find((r) => r.id === score.trackId);
                  const submission = edits?.find((x) => x.scoreId === score.id);
                  return (
                    <tr key={`${score.isLap ? "l" : "c"}${score.trackId}`}>
                      {score.precedesRepeat ? (
                        <td rowSpan={2}>
                          <span className="submission-timesheet-columns-b1">
                            {translateTrack(track, lang)}
                          </span>
                          <span className="submission-timesheet-columns-s1">{track?.abbr}</span>
                        </td>
                      ) : score.repeat ? (
                        <></>
                      ) : (
                        <td>
                          <span className="submission-timesheet-columns-b1">
                            {translateTrack(track, lang)}
                          </span>
                          <span className="submission-timesheet-columns-s1">{track?.abbr}</span>
                        </td>
                      )}
                      {score.isLap && lapMode === LapModeEnum.Overall && <td />}
                      <td className={score?.category !== category ? "fallthrough" : ""}>
                        {formatTime(score.value)}
                      </td>
                      {!score.isLap && lapMode === LapModeEnum.Overall && <td />}
                      <td>{score.rank}</td>
                      <td>{formatDate(secondsToDate(score.date))}</td>
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
                          <Tooltip title={score.comment}>
                            <span>
                              <Icon icon="Comment" />
                            </span>
                          </Tooltip>
                        )}
                      </td>
                      <td className="icon-cell">
                        {submission && (
                          <Tooltip
                            title={
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
                                    [
                                      [
                                        "time",
                                        secondsToDate(submission.submittedAt).toLocaleString(lang),
                                      ],
                                    ],
                                  )}
                                </div>
                              </span>
                            }
                          >
                            <span>
                              <Icon icon="Note" />
                            </span>
                          </Tooltip>
                        )}
                      </td>
                      <td className="icon-cell">
                        {submission && (
                          <Tooltip
                            title={
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
                                        submission.reviewerId !== undefined &&
                                        submission.reviewerId !== null ? (
                                          <PlayerMention playerOrId={submission.reviewerId} />
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
                                        submission.reviewedAt
                                          ? secondsToDate(submission.reviewedAt).toLocaleString(
                                              lang,
                                            )
                                          : translate(
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
                            <span>
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
                            </span>
                          </Tooltip>
                        )}
                      </td>
                      <td className="icon-cell">
                        <TimesheetTabEditBtn
                          setReload={setReload}
                          score={score}
                          patchUpData={
                            submission?.status === SubmissionStatus.Pending ? submission : undefined
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Deferred>
      </OverwriteColor>
    </div>
  );
};

const SubmissionPage = () => {
  const { isLoading, user } = useContext(UserContext);
  const { lang } = useContext(I18nContext);
  const navigate = useNavigate();

  return (
    <>
      <Link
        to=""
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        {translate("genericBackButton", lang)}
      </Link>
      <Deferred isWaiting={isLoading}>
        {!user && <Navigate to={resolvePage(Pages.UserLogin)} />}
        <h1>{translate("submissionPageTabbedModuleHeading", lang)}</h1>
        <TabbedModule>
          <Tab title={translate("submissionPageSubmitTabTitle", lang)} element={<SubmitTab />} />
          <Tab
            title={translate("submissionPageBulkSubmitTabTitle", lang)}
            element={<BulkSubmitTab />}
          />
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
