import { useContext, useEffect, useState } from "react";

import Deferred from "../global/Deferred";
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
import { getCategoryName } from "../../utils/EnumUtils";

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
        errors: { non_field_errors: ["No player profile linked."] },
      }));
      return;
    }

    const value = parseTime(state.value);
    if (!value) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, value: ["Invalid time value."] },
      }));
      errored = true;
    }

    const date = Date.parse(state.date);
    if (Number.isNaN(date)) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, date: ["Invalid date."] },
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
            setState((prev) => ({ ...prev, errors: { non_field_errors: ["An error occured."] } }));
          });
        done();
      });
  };

  return (
    <div className="module-content">
      <Deferred isWaiting={metadata.isLoading}>
        {state.state === SubmitStateEnum.Form && (
          <Form state={state} setState={setState} submitLabel="Submit" submit={submit}>
            <TrackSelect metadata={metadata} field="track" label="Track" />
            <CategoryField options={categories} field="category" label="Category" />
            <LapModeField field="lapMode" label="Mode" />
            <Field type="text" field="value" label="Time" placeholder={"1'23\"456"} />
            <Field type="date" field="date" label="Date" />
            <Field type="text" field="ghostLink" label="Ghost" />
            <Field type="text" field="videoLink" label="Video" />
            <Field type="text" field="comment" label="Comment" />
          </Form>
        )}
        {state.state === SubmitStateEnum.Success && (
          <>
            <p>
              Your time has been submitted successfully! Please wait for a moderator to review it.
            </p>
            <br />
            <button onClick={() => setState(initialState)}>Submit Another Time</button>
          </>
        )}
      </Deferred>
    </div>
  );
};

const BulkSubmitTab = () => {
  return <div className="module-content">Under construction...</div>;
};

const SubmissionsTab = () => {
  const metadata = useContext(MetadataContext);

  const { isLoading, data: submissions } = useApi(() => api.timetrialsSubmissionsList());

  return (
    <div className="module-content">
      <Deferred isWaiting={isLoading || metadata.isLoading}>
        <div className="card-container">
          {submissions?.map((submission) => (
            <div key={submission.id} className="card">
              <p className="nobr">
                {getTrackById(metadata, submission.track)?.name}&nbsp;
                {getCategoryName(submission.category)}&nbsp;
                {submission.isLap ? "Lap" : "Course"}
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

  return (
    <>
      <Deferred isWaiting={isLoading}>
        {!user && <Navigate to={resolvePage(Pages.UserLogin)} />}
        <h1>Submit Times</h1>
        <TabbedModule>
          <Tab title="Submit" element={<SubmitTab />} />
          <Tab title="Bulk Submit" element={<BulkSubmitTab />} />
          <Tab title="My Submissions" element={<SubmissionsTab />} />
        </TabbedModule>
      </Deferred>
    </>
  );
};

export default SubmissionPage;
