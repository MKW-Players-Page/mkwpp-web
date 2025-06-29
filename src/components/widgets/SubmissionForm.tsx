import init, { read_rkg } from "mkw_lib";

import { useContext, useEffect, useState } from "react";
import { useApi } from "../../hooks";
import { formatDate, formatTime, parseTime } from "../../utils/Formatters";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import { MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { CategoryRadioField } from "./CategorySelect";
import Deferred from "./Deferred";
import Form, { Field } from "./Form";
import { CategoryEnum, LapModeEnum, Score, stringToCategoryEnum, User } from "../../api";
import { LapModeRadioField } from "./LapModeSelect";
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
  submissionId?: number;
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
  submissionId,
  editModeScore,
  doneFunc,
  onSuccess,
  disclaimerText,
}: StarterData) => {
  const { user } = useContext(UserContext);

  const initialState = {
    state: SubmitStateEnum.Form,
    player: starterPlayer ?? user?.playerId ?? 1,
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
  if (doneFunc === undefined || doneFunc === null)
    doneFunc = () => {
      setState(initialState);
      if (onSuccess !== undefined) onSuccess();
    };

  const { lang } = useContext(I18nContext);

  const metadata = useContext(MetadataContext);

  const track = metadata.getTrackById(+state.track);
  const categories = track ? track.categories : [];

  useEffect(() => {
    if (
      track &&
      !track.categories.includes(
        typeof state.category === "string" ? stringToCategoryEnum(state.category) : state.category,
      )
    ) {
      setState((prev) => ({ ...prev, category: CategoryEnum.NonShortcut }));
    }
  }, [state, track]);

  const { data: submittees } = useApi(() => User.getSubmitteeList(user?.userId ?? 0, metadata));

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
        ? submissionId !== undefined
          ? async () =>
              User.editEditSubmission(
                submissionId,
                user?.userId,
                editModeScore.id,
                new Date(date),
                state.submitterNote,
                (editModeScore.videoLink ?? "") !== state.videoLink ? state.videoLink : undefined,
                (editModeScore.ghostLink ?? "") !== state.ghostLink ? state.ghostLink : undefined,
                (editModeScore.comment ?? "") !== state.comment ? state.comment : undefined,
              )
          : async () =>
              User.createEditSubmission(
                user?.userId,
                editModeScore.id,
                new Date(date),
                state.submitterNote,
                (editModeScore.videoLink ?? "") !== state.videoLink ? state.videoLink : undefined,
                (editModeScore.ghostLink ?? "") !== state.ghostLink ? state.ghostLink : undefined,
                (editModeScore.comment ?? "") !== state.comment ? state.comment : undefined,
              )
        : submissionId !== undefined
          ? async () =>
              User.editSubmission(
                submissionId,
                user.userId,
                value as number,
                state.category,
                state.lapMode === LapModeEnum.Lap,
                state.player,
                +state.track,
                new Date(date),
                state.videoLink,
                state.ghostLink,
                state.comment,
                state.submitterNote,
              )
          : async () =>
              User.createSubmission(
                user.userId,
                value as number,
                state.category,
                state.lapMode === LapModeEnum.Lap,
                state.player,
                +state.track,
                new Date(date),
                state.videoLink,
                state.ghostLink,
                state.comment,
                state.submitterNote,
              );

    uploadFunction()
      .then(() => {
        setState({ ...initialState, state: SubmitStateEnum.Success });
        done();
      })
      .catch((error) => {
        setState((prev) => ({ ...prev, errors: error }));
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
                {submissionId !== undefined && (
                  <div
                    onClick={() => {
                      const deleteFunction =
                        editModeScore !== undefined
                          ? async () => {
                              return User.deleteEditSubmission(user?.userId ?? 0, submissionId);
                            }
                          : async () => {
                              return User.deleteSubmission(user?.userId ?? 0, submissionId);
                            };

                      deleteFunction().then(() => {
                        if (doneFunc !== undefined) doneFunc();
                      });
                    }}
                    className="submit-style"
                  >
                    {translate("submissionPageSubmitTabDeleteBtn", lang)}
                  </div>
                )}
                {submissionId === undefined && editModeScore === undefined && (
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
                      submissionId !== undefined ? state.player : (user?.playerId ?? 0),
                      ...(submittees === undefined || submittees === null || submittees.length === 0
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
