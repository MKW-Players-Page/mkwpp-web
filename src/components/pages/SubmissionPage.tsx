import { useContext, useEffect, useState } from "react";

import Deferred from "../widgets/Deferred";
import {
  CategoryField,
  Icon,
  LapModeField,
  Tab,
  TabbedModule,
  Tooltip,
  TrackSelect,
} from "../widgets";
import api, { CategoryEnum, ScoreSubmission } from "../../api";
import { ResponseError } from "../../api/generated";
import { getTrackById, MetadataContext } from "../../utils/Metadata";
import { LapModeEnum } from "../widgets/LapModeSelect";
import Form, { Field } from "../widgets/Form";
import { formatTime, parseTime } from "../../utils/Formatters";
import { UserContext } from "../../utils/User";
import { Navigate } from "react-router-dom";
import { Pages, resolvePage } from "./Pages";
import { useApi } from "../../hooks";
import { getCategoryNameTranslationKey } from "../../utils/EnumUtils";
import { I18nContext, TranslationKey } from "../../utils/i18n/i18n";

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
  errors: { [key: string]: string[] };
  submitting: boolean;
}

const SubmitTab = () => {
  const initialState = {
    state: SubmitStateEnum.Form,
    track: "",
    category: CategoryEnum.NonShortcut,
    lapMode: LapModeEnum.Course,
    value: "",
    date: "",
    ghostLink: "",
    videoLink: "",
    comment: "",
    errors: {},
    submitting: false,
  };
  const [state, setState] = useState<SubmitTabState>(initialState);

  const { user } = useContext(UserContext);
  const { translations, lang } = useContext(I18nContext);

  const metadata = useContext(MetadataContext);

  useEffect(() => {
    if (state.track === "" && metadata.tracks) {
      setState((prev) => ({ ...prev, track: metadata.tracks?.at(0)?.id.toString() || "" }));
    }
  }, [metadata, state]);

  const track = getTrackById(metadata, +state.track);
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
          non_field_errors: [translations.submissionPageSubmitTabNoPlayerProfileLinkErr[lang]],
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
          value: [translations.submissionPageSubmitTabInvalidTimeErr[lang]],
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
          date: [translations.submissionPageSubmitTabInvalidDateErr[lang]],
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
          value: value as number,
          track: +state.track,
          category: state.category,
          isLap: state.lapMode === LapModeEnum.Lap,
          date: new Date(date),
          ghostLink: state.ghostLink,
          videoLink: state.videoLink,
          comment: state.comment,
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
              errors: { non_field_errors: [translations.submissionPageSubmitTabGenericErr[lang]] },
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
            submitLabel={translations.submissionPageSubmitTabSubmitSubmitLabel[lang]}
            submit={submit}
          >
            <TrackSelect
              metadata={metadata}
              field="track"
              label={translations.submissionPageSubmitTabTrackLabel[lang]}
            />
            <CategoryField
              options={categories}
              field="category"
              label={translations.submissionPageSubmitTabCategoryLabel[lang]}
            />
            <LapModeField
              field="lapMode"
              label={translations.submissionPageSubmitTabModeLabel[lang]}
            />
            <Field
              type="text"
              field="value"
              label={translations.submissionPageSubmitTabTimeLabel[lang]}
              placeholder={`1'23"456`}
            />
            <Field
              type="date"
              field="date"
              min="2009-04-01"
              max={`${todayDate.getFullYear().toString().padStart(4, "0")}-${(todayDate.getMonth() + 1).toString().padStart(2, "0")}-${todayDate.getDate().toString().padStart(2, "0")}`}
              label={translations.submissionPageSubmitTabDateLabel[lang]}
            />
            <Field
              type="text"
              field="ghostLink"
              label={translations.submissionPageSubmitTabGhostLabel[lang]}
            />
            <Field
              type="text"
              field="videoLink"
              label={translations.submissionPageSubmitTabVideoLabel[lang]}
            />
            <Field
              type="text"
              field="comment"
              label={translations.submissionPageSubmitTabCommentLabel[lang]}
            />
          </Form>
        )}
        {state.state === SubmitStateEnum.Success && (
          <>
            <p>{translations.submissionPageSubmitTabSuccessStateParagraph[lang]}</p>
            <br />
            <button onClick={() => setState(initialState)}>
              {translations.submissionPageSubmitTabSuccessStateButton[lang]}
            </button>
          </>
        )}
      </Deferred>
    </div>
  );
};

const BulkSubmitTab = () => {
  const { translations, lang } = useContext(I18nContext);
  return (
    <div className="module-content">
      {translations.submissionPageBulkSubmitTabUnderConstruction[lang]}
    </div>
  );
};

const SubmissionsTab = () => {
  const metadata = useContext(MetadataContext);
  const { translations, lang } = useContext(I18nContext);

  const { isLoading, data: submissions } = useApi(
    () => api.timetrialsSubmissionsList(),
    [],
    "trackSubmissions",
  );

  return (
    <div className="module-content">
      <Deferred isWaiting={isLoading || metadata.isLoading}>
        <div className="card-container">
          {submissions?.map((submission) => (
            <div key={submission.id} className="card">
              <p className="nobr">
                {
                  translations[
                    `constantTrackName${getTrackById(metadata, submission.track)?.abbr.toUpperCase()}` as TranslationKey
                  ][lang]
                }
                ,&nbsp;
                {translations[getCategoryNameTranslationKey(submission.category)][lang]},&nbsp;
                {submission.isLap
                  ? translations.constantLapModeLap[lang]
                  : translations.constantLapModeCourse[lang]}
              </p>
              <p>{formatTime(submission.value)}</p>
              <p>
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
                  <Tooltip text={submission.comment}>
                    <Icon icon="Comment" />
                  </Tooltip>
                )}
              </p>
            </div>
          ))}
        </div>
      </Deferred>
    </div>
  );
};

const SubmissionPage = () => {
  const { isLoading, user } = useContext(UserContext);
  const { translations, lang } = useContext(I18nContext);

  return (
    <>
      <Deferred isWaiting={isLoading}>
        {!user && <Navigate to={resolvePage(Pages.UserLogin)} />}
        <h1>{translations.submissionPageTabbedModuleHeading[lang]}</h1>
        <TabbedModule>
          <Tab title={translations.submissionPageSubmitTabTitle[lang]} element={<SubmitTab />} />
          <Tab
            title={translations.submissionPageBulkSubmitTabTitle[lang]}
            element={<BulkSubmitTab />}
          />
          <Tab
            title={translations.submissionPageSubmissionsTabTitle[lang]}
            element={<SubmissionsTab />}
          />
        </TabbedModule>
      </Deferred>
    </>
  );
};

export default SubmissionPage;
