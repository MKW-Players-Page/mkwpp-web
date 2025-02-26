import { useContext, useRef, useState } from "react";
import init, { read_rksys, RKG } from "mkw_lib";

import Deferred from "../widgets/Deferred";
import { Icon, Tab, TabbedModule, Tooltip } from "../widgets";
import api, { CategoryEnum, EditScoreSubmission, Score } from "../../api";
import { Track } from "../../rust_api";
import { getTrackById, MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Pages, resolvePage } from "./Pages";
import { useApi } from "../../hooks";
import { handleBars, I18nContext, translate, translateTrack } from "../../utils/i18n/i18n";
import SubmissionForm from "../widgets/SubmissionForm";
import SubmissionCard from "../widgets/SubmissionCard";
import RadioButtons from "../widgets/RadioButtons";
import { LapModeEnum, LapModeRadio } from "../widgets/LapModeSelect";
import { formatDate, formatTime } from "../../utils/Formatters";
import { CategoryRadio } from "../widgets/CategorySelect";
import OverwriteColor from "../widgets/OverwriteColor";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import { SettingsContext } from "../../utils/Settings";
import ObscuredModule from "../widgets/ObscuredModule";
import PlayerMention from "../widgets/PlayerMention";
import ArrayTable, { ArrayTableCellData } from "../widgets/Table";
import { SmallBigDateFormat, SmallBigTrackFormat } from "../widgets/SmallBigFormat";

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
            starterValue={formatTime(data.time)}
            starterDate={formatDate(data.date)}
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

  const lic1 = useRef<null | HTMLInputElement>(null);
  const lic2 = useRef<null | HTMLInputElement>(null);
  const lic3 = useRef<null | HTMLInputElement>(null);
  const lic4 = useRef<null | HTMLInputElement>(null);

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
          <div className="module-row">
            <label htmlFor="lic1">
              {handleBars(translate("submissionPageBulkSubmitTabLicence", lang), [["number", 1]])}
            </label>
            <input type="checkbox" id="lic1" ref={lic1} defaultChecked />
          </div>
          <div className="module-row">
            <label htmlFor="lic2">
              {handleBars(translate("submissionPageBulkSubmitTabLicence", lang), [["number", 2]])}
            </label>
            <input type="checkbox" id="lic2" ref={lic2} defaultChecked />
          </div>
          <div className="module-row">
            <label htmlFor="lic3">
              {handleBars(translate("submissionPageBulkSubmitTabLicence", lang), [["number", 3]])}
            </label>
            <input type="checkbox" id="lic3" ref={lic3} defaultChecked />
          </div>
          <div className="module-row">
            <label htmlFor="lic4">
              {handleBars(translate("submissionPageBulkSubmitTabLicence", lang), [["number", 4]])}
            </label>
            <input type="checkbox" id="lic4" ref={lic4} defaultChecked />
          </div>
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
            const bitMapLicenses =
              0b0000 |
              (lic1.current && lic1.current.checked ? 0b0001 : 0) |
              (lic2.current && lic2.current.checked ? 0b0010 : 0) |
              (lic3.current && lic3.current.checked ? 0b0100 : 0) |
              (lic4.current && lic4.current.checked ? 0b1000 : 0);
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
                      track: getTrackById(metadata.tracks, track + 1) as Track,
                      date: new Date(
                        `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
                      ),
                    };
                  });

                  setTimes((prev) => [...prev, ...newTimes]);
                } catch (e) {
                  console.log("wasm error:", e);
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
          {
            text: translate("submissionPageMySubmissionsTabFilterByYou", lang),
            value: SubmissionFilter.ByYou,
          },
          {
            text: translate("submissionPageMySubmissionsTabFilterForYou", lang),
            value: SubmissionFilter.ForYou,
          },
          {
            text: translate("submissionPageMySubmissionsTabFilterAll", lang),
            value: SubmissionFilter.All,
          },
        ]}
      />
      <Deferred isWaiting={isLoading || metadata.isLoading}>
        <div key={reload} className="card-container">
          {submissions
            ?.filter((submission) =>
              filter === SubmissionFilter.All
                ? true
                : filter === SubmissionFilter.ByYou
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
            starterTrack={score.track}
            starterCategory={score.category}
            starterLapMode={score.isLap ? LapModeEnum.Lap : LapModeEnum.Course}
            starterValue={formatTime(score.value)}
            starterDate={score.date ? formatDate(score.date) : undefined}
            deleteId={patchUpData?.id}
            starterGhostLink={patchUpData?.ghostLink ?? score.ghostLink ?? undefined}
            starterVideoLink={patchUpData?.videoLink ?? score.videoLink ?? undefined}
            starterComment={patchUpData?.comment ?? score.comment ?? undefined}
            starterSubmitterNote={patchUpData?.submitterNote ?? undefined}
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
  flapOnly: (a: Score) => a.isLap,
  courseOnly: (a: Score) => !a.isLap,
  overall: (a: Score) => true,
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
                  const track = metadata.tracks?.find((r) => r.id === score.track);
                  const submission = edits?.find((x) => x.score.id === score.id);
                  return (
                    <tr key={`${score.isLap ? "l" : "c"}${score.track}`}>
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
                            ) : submission.status === "pending" ||
                              submission.status === "on_hold" ? (
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
                          patchUpData={submission?.status === "pending" ? submission : undefined}
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
