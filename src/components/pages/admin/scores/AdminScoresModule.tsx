import { Box, Switch, Tooltip } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AdminScore, CategoryEnum, LapModeEnum } from "../../../../api";
import { MetadataContext } from "../../../../utils/Metadata";
import { mkwReleaseDate } from "../../../../utils/Numbers";
import { TrackSelect } from "../../../widgets";
import { CategoryRadioField } from "../../../widgets/CategorySelect";

import Form, { DateFormField, FormState, TextFormField } from "../../../widgets/Form";
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
  date: Dayjs;
  videoLink?: string;
  ghostLink?: string;
  comment?: string;
  adminNote?: string;
}

const AdminScoreModule = ({ score }: AdminScoreModuleProps) => {
  const metadata = useContext(MetadataContext);
  const initialState: AdminScoreModuleState = {
    value: score?.value ?? 0,
    category: score?.category ?? CategoryEnum.NonShortcut,
    lapMode: score?.isLap ? LapModeEnum.Lap : LapModeEnum.Course,
    playerId: score?.playerId ?? 1,
    trackId: score?.trackId ?? 1,
    date: score?.date ? dayjs.unix(score.date) : dayjs(mkwReleaseDate),
    videoLink: score?.videoLink ?? "",
    ghostLink: score?.ghostLink ?? "",
    comment: score?.comment ?? "",
    adminNote: score?.adminNote ?? "",
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
          state.date.toDate(),
          state.videoLink === "" ? undefined : state.videoLink,
          state.ghostLink === "" ? undefined : state.ghostLink,
          state.comment === "" ? undefined : state.comment,
          state.adminNote === "" ? undefined : state.adminNote,
        )
    : async () =>
        AdminScore.insertScore(
          state.value,
          state.category,
          state.lapMode === LapModeEnum.Lap,
          state.playerId,
          state.trackId,
          state.date.toDate(),
          state.videoLink === "" ? undefined : state.videoLink,
          state.ghostLink === "" ? undefined : state.ghostLink,
          state.comment === "" ? undefined : state.comment,
          state.adminNote === "" ? undefined : state.adminNote,
        );

  const submit = () =>
    apiFunction()
      .then(() => {
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
                AdminScore.deleteScore(score.id).then(() => navigate(0));
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
            <Tooltip title={"This should not be modified while the server is running."}>
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
        <DateFormField field="date" label="Date" />
        <TextFormField field="videoLink" label="Video Link" />
        <TextFormField field="ghostLink" label="Ghost Link" />
        <TextFormField field="comment" label="Comment" />
        <TextFormField field="adminNote" label="Admin Note" />
        <Box>
          <p>Was WR?</p>
          <Switch disabled defaultChecked={score?.wasWr ?? false} />
          <p>
            This cannot be changed because it's recalculated by the backend every time to be correct
          </p>
        </Box>
      </Form>
    </div>
  );
};

export default AdminScoreModule;
