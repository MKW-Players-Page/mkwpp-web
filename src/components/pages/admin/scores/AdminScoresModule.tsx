import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminScore, CategoryEnum, LapModeEnum } from "../../../../api";
import { secondsToDate } from "../../../../utils/DateUtils";
import { formatDate } from "../../../../utils/Formatters";
import { MetadataContext } from "../../../../utils/Metadata";
import { mkwReleaseDate } from "../../../../utils/Numbers";
import { Tooltip, TrackSelect } from "../../../widgets";
import { CategoryRadioField } from "../../../widgets/CategorySelect";

import Form, { FormState, Field } from "../../../widgets/Form";
import { LapModeRadioField } from "../../../widgets/LapModeSelect";
import { PlayerSelectDropdownField } from "../../../widgets/PlayerSelectDropdown";
import { TimeInputField } from "../../../widgets/TimeInput";

export interface AdminScoreModuleProps {
  score?: AdminScore;
}

interface AdminScoreModuleState extends FormState {
  value: number;
  category: CategoryEnum;
  lapMode: LapModeEnum;
  playerId: number;
  trackId: number;
  date: Date;
  videoLink?: string;
  ghostLink?: string;
  comment?: string;
  adminNote?: string;
  initialRank?: number;
}

const AdminScoreModule = ({ score }: AdminScoreModuleProps) => {
  const metadata = useContext(MetadataContext);
  const initialState: AdminScoreModuleState = {
    value: score?.value ?? 0,
    category: score?.category ?? CategoryEnum.NonShortcut,
    lapMode: score?.isLap ? LapModeEnum.Lap : LapModeEnum.Course,
    playerId: score?.playerId ?? 1,
    trackId: score?.trackId ?? 1,
    date: score?.date ? secondsToDate(score.date) : new Date(mkwReleaseDate),
    videoLink: score?.videoLink ?? "",
    ghostLink: score?.ghostLink ?? "",
    comment: score?.comment ?? "",
    adminNote: score?.adminNote ?? "",
    initialRank: score?.initialRank ?? 2147483647,
    errors: {},
    submitting: false,
  };

  const navigate = useNavigate();
  const [state, setState] = useState<AdminScoreModuleState>(initialState);

  const apiFunction = score
    ? async () =>
        AdminScore.editScore(
          score.id,
          state.value,
          state.category,
          state.lapMode === LapModeEnum.Lap,
          state.playerId,
          state.trackId,
          state.date,
          state.videoLink === "" ? undefined : state.videoLink,
          state.ghostLink === "" ? undefined : state.ghostLink,
          state.comment === "" ? undefined : state.comment,
          state.adminNote === "" ? undefined : state.adminNote,
          state.initialRank === 2147483647 ? undefined : state.initialRank,
        )
    : async () =>
        AdminScore.insertScore(
          state.value,
          state.category,
          state.lapMode === LapModeEnum.Lap,
          state.playerId,
          state.trackId,
          state.date,
          state.videoLink === "" ? undefined : state.videoLink,
          state.ghostLink === "" ? undefined : state.ghostLink,
          state.comment === "" ? undefined : state.comment,
          state.adminNote === "" ? undefined : state.adminNote,
          state.initialRank === 2147483647 ? undefined : state.initialRank,
        );

  const submit = () =>
    apiFunction()
      .then((r) => {
        setState({ ...initialState });
        navigate(0);
      })
      .catch((error) => {
        setState((prev) => ({ ...prev, errors: error }));
      });

  return (
    <div className="module-content">
      <Form
        submit={submit}
        state={state}
        setState={setState}
        title="Scores Editor"
        submitLabel="Save"
        extraButtons={
          score ? (
            <div
              onClick={() => {
                AdminScore.deleteScore(score.id).then((r) => navigate(0));
              }}
              className="submit-style"
            >
              Delete
            </div>
          ) : undefined
        }
      >
        {score ? (
          <p>
            <Tooltip text={"This should not be modified while the server is running."} left>
              <span style={{ fontWeight: "700", fontSize: "1.4em" }}>ID - {score.id}</span>
            </Tooltip>
          </p>
        ) : (
          <></>
        )}
        <PlayerSelectDropdownField label="Player" field="playerId" />
        <TrackSelect field="trackId" label="Track" />
        <CategoryRadioField
          options={metadata.getTrackById(state.trackId)?.categories ?? [0]}
          field="category"
          label="Category"
        />
        <LapModeRadioField field="lapMode" label="Lap Mode" />

        <TimeInputField field="value" label="Time" />
        <Field
          type="date"
          field="date"
          label="Date"
          fromStringFunction={(x) => new Date(Date.parse(x))}
          toStringFunction={formatDate}
        />
        <Field type="text" field="videoLink" label="Video Link" />
        <Field type="text" field="ghostLink" label="Ghost Link" />
        <Field type="text" field="comment" label="Comment" />
        <Field type="text" field="adminNote" label="Admin Note" />
        <Field
          fromStringFunction={(x) => parseInt(x)}
          toStringFunction={(x) => String(x)}
          type="number"
          field="initialRank"
          label="Initial Rank"
          max="2147483647"
        />
      </Form>
    </div>
  );
};

export default AdminScoreModule;
