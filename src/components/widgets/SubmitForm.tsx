import { useContext, useEffect, useState } from "react";
import api, { CategoryEnum, ScoreSubmission } from "../../api";
import { ResponseError } from "../../api/generated";
import { parseTime } from "../../utils/Formatters";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import { getTrackById, MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { CategoryRadioField } from "./CategorySelect";
import Deferred from "./Deferred";
import Form, { Field } from "./Form";
import { LapModeEnum, LapModeRadioField } from "./LapModeSelect";
import Tooltip from "./Tooltip";
import TrackSelect from "./TrackSelect";

enum SubmitStateEnum {
  Form = "form",
  Success = "success",
}

interface SubmitTabState {
  state: SubmitStateEnum;
  /** Active track id */
  track: string;
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
  starterTrack?: string;
  starterCategory?: CategoryEnum;
  starterLapMode?: LapModeEnum;
  starterValue?: string;
  starterDate?: string;
  starterGhostLink?: string;
  starterVideoLink?: string;
  starterComment?: string;
  starterSubmitterNote?: string;
}

const SubmitForm = ({
  starterTrack,
  starterCategory,
  starterLapMode,
  starterValue,
  starterDate,
  starterGhostLink,
  starterVideoLink,
  starterComment,
  starterSubmitterNote,
}: StarterData) => {
  const initialState = {
    state: SubmitStateEnum.Form,
    track: starterTrack ?? "",
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

  const { user } = useContext(UserContext);
  const { lang } = useContext(I18nContext);

  const metadata = useContext(MetadataContext);

  useEffect(() => {
    if (state.track === "" && metadata.tracks) {
      setState((prev) => ({ ...prev, track: metadata.tracks?.at(0)?.id.toString() || "" }));
    }
  }, [metadata, state]);

  const track = getTrackById(metadata.tracks, +state.track);
  const categories = track ? track.categories : [];

  useEffect(() => {
    if (track && !track.categories.includes(state.category)) {
      setState((prev) => ({ ...prev, category: CategoryEnum.NonShortcut }));
    }
  }, [state, track]);

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

    if (errored) {
      done();
      return;
    }

    api
      .timetrialsSubmissionsCreateCreate({
        scoreSubmission: {
          playerId: user.player, // TODO: `Localized` updaters
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
      })
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
              errors: { non_field_errors: [translate("submissionPageSubmitTabGenericErr", lang)] },
            }));
          });
        done();
      });
  };

  const todayDate = new Date();

  return (
    <div className="module-content">
      <Deferred isWaiting={metadata.isLoading}>
        {state.state === SubmitStateEnum.Form && (
          <Form
            state={state}
            setState={setState}
            submitLabel={translate("submissionPageSubmitTabSubmitSubmitLabel", lang)}
            submit={submit}
          >
            <TrackSelect
              metadata={metadata}
              field="track"
              label={translate("submissionPageSubmitTabTrackLabel", lang)}
            />
            <CategoryRadioField
              options={categories}
              field="category"
              label={translate("submissionPageSubmitTabCategoryLabel", lang)}
            />
            <LapModeRadioField
              field="lapMode"
              label={translate("submissionPageSubmitTabModeLabel", lang)}
            />
            <Field
              type="text"
              field="value"
              label={translate("submissionPageSubmitTabTimeLabel", lang)}
              placeholder={`1'23"456`}
            />
            <Field
              type="date"
              field="date"
              min="2009-04-01"
              max={`${todayDate.getFullYear().toString().padStart(4, "0")}-${(todayDate.getMonth() + 1).toString().padStart(2, "0")}-${todayDate.getDate().toString().padStart(2, "0")}`}
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
            <Tooltip
              text={translate("submissionPageSubmitTabSubmitterNoteTooltip", lang)}
              left={true}
            >
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
            <button onClick={() => setState(initialState)}>
              {translate("submissionPageSubmitTabSuccessStateButton", lang)}
            </button>
          </>
        )}
      </Deferred>
    </div>
  );
};

export default SubmitForm;
