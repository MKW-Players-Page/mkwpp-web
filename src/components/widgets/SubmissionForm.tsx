import init, { read_rkg } from "mkw_lib";

import { useContext, useEffect, useState } from "react";
import api, { CategoryEnum, ScoreSubmission } from "../../api";
import { EditScoreSubmission, ResponseError, Score } from "../../api/generated";
import { useApi } from "../../hooks";
import { formatDate, formatTime, parseTime } from "../../utils/Formatters";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import { getTrackById, MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { CategoryRadioField } from "./CategorySelect";
import Deferred from "./Deferred";
import Form, { Field } from "./Form";
import { LapModeEnum, LapModeRadioField } from "./LapModeSelect";
import OverwriteColor from "./OverwriteColor";
import { PlayerSelectDropdownField } from "./PlayerSelectDropdown";
import Tooltip from "./Tooltip";
import TrackSelect from "./TrackSelect";

enum SubmitStateEnum {
  Form = "form",
  Success = "success",
}

interface SubmitTabState {
  state: SubmitStateEnum;
  /** Active track id */
  player: number;
  track: number;
  category: CategoryEnum;
  lapMode: LapModeEnum;
  value: string;
  date: string;
  ghostLink: string;
  videoLink: string;
  comment: string;
  submitterNote: string;
  errors: { [key: string]: string[] };
  submitting: boolean;
}

export interface StarterData {
  starterPlayer?: number;
  starterTrack?: number;
  starterCategory?: CategoryEnum;
  starterLapMode?: LapModeEnum;
  starterValue?: string;
  starterDate?: string;
  starterGhostLink?: string;
  starterVideoLink?: string;
  starterComment?: string;
  starterSubmitterNote?: string;
  deleteId?: number;
  editModeScore?: Score;
  doneFunc?: () => void;
  onSuccess?: () => void;
  disclaimerText?: string;
}

const SubmissionForm = ({
  starterPlayer,
  starterTrack,
  starterCategory,
  starterLapMode,
  starterValue,
  starterDate,
  starterGhostLink,
  starterVideoLink,
  starterComment,
  starterSubmitterNote,
  deleteId,
  editModeScore,
  doneFunc,
  onSuccess,
  disclaimerText,
}: StarterData) => {
  const { user } = useContext(UserContext);

  const initialState = {
    state: SubmitStateEnum.Form,
    player: starterPlayer ?? user?.player ?? 1,
    track: starterTrack ?? 1,
    category: starterCategory ?? CategoryEnum.NonShortcut,
    lapMode: starterLapMode ?? LapModeEnum.Course,
    value: starterValue ?? "",
    date: starterDate ?? "",
    ghostLink: starterGhostLink ?? "",
    videoLink: starterVideoLink ?? "",
    comment: starterComment ?? "",
    submitterNote: starterSubmitterNote ?? "",
    errors: {},
    submitting: false,
  };
  const [state, setState] = useState<SubmitTabState>(initialState);
  if (doneFunc === undefined || doneFunc === null) doneFunc = () => setState(initialState);

  const { lang } = useContext(I18nContext);

  const metadata = useContext(MetadataContext);

  const track = getTrackById(metadata.tracks, +state.track);
  const categories = track ? track.categories : [];

  useEffect(() => {
    if (track && !track.categories.includes(state.category)) {
      setState((prev) => ({ ...prev, category: CategoryEnum.NonShortcut }));
    }
  }, [state, track]);

  const { data: submittees } = useApi(() => api.timetrialsSubmissionsSubmitteesList());

  const deleteFunction =
    deleteId !== undefined
      ? editModeScore !== undefined
        ? async (id: number) => {
            return api.timetrialsSubmissionsEditsDeleteDestroy({
              id: id,
            });
          }
        : async (id: number) => {
            return api.timetrialsSubmissionsDeleteDestroy({
              id: id,
            });
          }
      : async (x: any) => {};

  const submit = (done: () => void) => {
    setState((prev) => ({ ...prev, errors: {} }));

    let errored = false;

    if (!user) {
      setState((prev) => ({
        ...prev,
        errors: {
          non_field_errors: [translate("submissionPageSubmitTabNoPlayerProfileLinkErr", lang)],
        },
      }));
      return;
    }

    const value = parseTime(state.value);
    if (!value) {
      setState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          value: [translate("submissionPageSubmitTabInvalidTimeErr", lang)],
        },
      }));
      errored = true;
    }

    const date = Date.parse(state.date);
    if (Number.isNaN(date)) {
      setState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          date: [translate("submissionPageSubmitTabInvalidDateErr", lang)],
        },
      }));
      errored = true;
    }

    if (
      editModeScore !== undefined &&
      initialState.ghostLink === state.ghostLink &&
      initialState.comment === state.comment &&
      initialState.videoLink === state.videoLink
    ) {
      setState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          non_field_errors: [translate("submissionPageSubmitTabNoEditErr", lang)],
        },
      }));
      errored = true;
    }

    if (errored) {
      done();
      return;
    }

    const uploadFunction: () => Promise<any> =
      editModeScore !== undefined
        ? async () => {
            let out = {
              scoreId: editModeScore.id,
              submitterNote: state.submitterNote,
            };

            if ((editModeScore.ghostLink ?? "") !== state.ghostLink)
              (out as any).ghostLink = state.ghostLink;

            if ((editModeScore.comment ?? "") !== state.comment)
              (out as any).comment = state.comment;

            if ((editModeScore.videoLink ?? "") !== state.videoLink)
              (out as any).videoLink = state.videoLink;
            // TODO: fix openapi
            return api.timetrialsSubmissionsEditsCreateCreate({
              editScoreSubmission: out as EditScoreSubmission,
            });
          }
        : async () =>
            api.timetrialsSubmissionsCreateCreate({
              scoreSubmission: {
                playerId: state.player,
                value: value as number,
                track: +state.track,
                category: state.category,
                isLap: state.lapMode === LapModeEnum.Lap,
                date: new Date(date),
                ghostLink: state.ghostLink,
                videoLink: state.videoLink,
                comment: state.comment,
                submitterNote: state.submitterNote,
              } as ScoreSubmission,
            });

    deleteFunction(deleteId as number)
      .then(uploadFunction)
      .then(() => {
        setState({ ...initialState, state: SubmitStateEnum.Success });
        done();
      })
      .catch((error: ResponseError) => {
        error.response
          .json()
          .then((json) => {
            setState((prev) => ({ ...prev, errors: { ...json } }));
          })
          .catch(() => {
            setState((prev) => ({
              ...prev,
              errors: {
                non_field_errors: [translate("submissionPageSubmitTabGenericErr", lang)],
              },
            }));
          });
        done();
      });
  };

  const todayDate = new Date();
  if (onSuccess !== undefined && state.state === SubmitStateEnum.Success) onSuccess();

  return (
    <div className="module-content">
      {disclaimerText && (
        <OverwriteColor hue={50}>
          <div style={{ padding: "5px" }} className="module">
            {"⚠️ "}
            {disclaimerText}
            {" ⚠️"}
          </div>
        </OverwriteColor>
      )}
      <Deferred isWaiting={metadata.isLoading}>
        {state.state === SubmitStateEnum.Form && (
          <Form
            extraButtons={
              <>
                {deleteId !== undefined && (
                  <div
                    onClick={() => {
                      deleteFunction(deleteId).then(() => {
                        if (doneFunc !== undefined) doneFunc();
                      });
                    }}
                    className="submit-style"
                  >
                    {translate("submissionPageSubmitTabDeleteBtn", lang)}
                  </div>
                )}
                {deleteId === undefined && editModeScore === undefined && (
                  <div
                    onClick={() => {
                      const actualUpload = document.createElement("input");
                      actualUpload.type = "file";
                      actualUpload.style.display = "hidden";
                      actualUpload.accept = ".rkg";
                      document.getElementById("root")?.appendChild(actualUpload);
                      actualUpload.click();
                      actualUpload.addEventListener("change", async () => {
                        const wasm = init();
                        wasm.then(async () => {
                          if (!actualUpload.files) return;

                          try {
                            const arr = new Uint8Array(await actualUpload.files[0].arrayBuffer());

                            const data = read_rkg(arr);

                            const newStateData = {
                              value: formatTime(data.time),
                              track: data.track + 1,
                              date: `${data.year}-${data.month.toString().padStart(2, "0")}-${data.day.toString().padStart(2, "0")}`,
                            };

                            data.free();

                            setState((prev) => ({
                              ...prev,
                              ...newStateData,
                            }));
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
                    {translate("submissionPageSubmitTabUploadRKGBtn", lang)}
                  </div>
                )}
              </>
            }
            state={state}
            setState={setState}
            submitLabel={translate("submissionPageSubmitTabSubmitSubmitLabel", lang)}
            submit={submit}
          >
            <PlayerSelectDropdownField
              disabled={editModeScore !== undefined}
              restrictSet={
                editModeScore !== undefined
                  ? [state.player]
                  : [
                      deleteId !== undefined ? state.player : (user?.player ?? 0),
                      ...(submittees === undefined || submittees.length === 0
                        ? []
                        : submittees.map((r) => r.id as number)),
                    ]
              }
              label={translate("submissionPageSubmitTabPlayerLabel", lang)}
              field="player"
            />
            <TrackSelect
              metadata={metadata}
              disabled={editModeScore !== undefined}
              field="track"
              label={translate("submissionPageSubmitTabTrackLabel", lang)}
            />
            <CategoryRadioField
              options={categories}
              disabled={editModeScore !== undefined}
              field="category"
              label={translate("submissionPageSubmitTabCategoryLabel", lang)}
            />
            <LapModeRadioField
              disabled={editModeScore !== undefined}
              field="lapMode"
              label={translate("submissionPageSubmitTabModeLabel", lang)}
            />
            <Field
              type="text"
              disabled={editModeScore !== undefined}
              field="value"
              label={translate("submissionPageSubmitTabTimeLabel", lang)}
              placeholder={`1'23"456`}
            />
            <Field
              type="date"
              field="date"
              disabled={editModeScore !== undefined}
              min="2008-04-01"
              max={formatDate(todayDate)}
              label={translate("submissionPageSubmitTabDateLabel", lang)}
            />
            <Field
              type="text"
              field="ghostLink"
              label={translate("submissionPageSubmitTabGhostLabel", lang)}
            />
            <Field
              type="text"
              field="videoLink"
              label={translate("submissionPageSubmitTabVideoLabel", lang)}
            />
            <Field
              type="text"
              field="comment"
              label={translate("submissionPageSubmitTabCommentLabel", lang)}
            />
            <Tooltip text={translate("submissionPageSubmitTabSubmitterNoteTooltip", lang)} left>
              <Field
                type="text"
                field="submitterNote"
                label={translate("submissionPageSubmitTabSubmitterNoteLabel", lang)}
              />
            </Tooltip>
          </Form>
        )}
        {state.state === SubmitStateEnum.Success && (
          <>
            <p>{translate("submissionPageSubmitTabSuccessStateParagraph", lang)}</p>
            <br />
            <button onClick={doneFunc}>
              {translate("submissionPageSubmitTabSuccessStateButton", lang)}
            </button>
          </>
        )}
      </Deferred>
    </div>
  );
};

export default SubmissionForm;
