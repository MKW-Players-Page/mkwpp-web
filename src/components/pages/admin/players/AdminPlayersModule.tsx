import { Tooltip } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminPlayer } from "../../../../api";
import { mkwReleaseDate } from "../../../../utils/Numbers";

import Form, { FormState, TextFormField, DateFormField } from "../../../widgets/Form";
import { RegionSelectionDropdownField } from "../../../widgets/RegionDropdown";

export interface AdminPlayerModuleProps {
  player?: AdminPlayer;
}

interface AdminPlayerModuleState extends FormState {
  name: string;
  regionId: number;
  joinedDate: Dayjs;
  lastActivity: Dayjs;
  submitters: Array<number>;
  alias?: string;
  bio?: string;
  pronouns?: string;
}

const AdminPlayerModule = ({ player }: AdminPlayerModuleProps) => {
  const initialState: AdminPlayerModuleState = {
    name: player?.name ?? "",
    regionId: player?.regionId ?? 1,
    joinedDate: player ? dayjs.unix(player.joinedDate) : dayjs(mkwReleaseDate),
    lastActivity: player ? dayjs.unix(player.lastActivity) : dayjs(mkwReleaseDate),
    submitters: player?.submitters ?? [],
    alias: player?.alias ?? "",
    bio: player?.bio ?? "",
    pronouns: player?.pronouns ?? "",
    errors: {},
    submitting: false,
  };

  const navigate = useNavigate();
  const [state, setState] = useState<AdminPlayerModuleState>(initialState);

  const apiFunction = player
    ? async () =>
        AdminPlayer.editPlayer(
          player.id,
          state.name,
          state.regionId,
          state.joinedDate.toDate(),
          state.lastActivity.toDate(),
          state.submitters,
          state.alias !== "" ? state.alias : undefined,
          state.bio !== "" ? state.bio : undefined,
          state.pronouns !== "" ? state.pronouns : undefined,
        )
    : async () =>
        AdminPlayer.insertPlayer(
          state.name,
          state.regionId,
          state.joinedDate.toDate(),
          state.lastActivity.toDate(),
          state.submitters,
          state.alias !== "" ? state.alias : undefined,
          state.bio !== "" ? state.bio : undefined,
          state.pronouns !== "" ? state.pronouns : undefined,
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
        title="Players Editor"
        submitLabel="Save"
        extraButtons={
          player ? (
            <div
              onClick={() => {
                AdminPlayer.deletePlayer(player.id).then((r) => navigate(0));
              }}
              className="submit-style"
            >
              Delete
            </div>
          ) : undefined
        }
      >
        {player ? (
          <p>
            <Tooltip title={"This should not be modified while the server is running."}>
              <span style={{ fontWeight: "700", fontSize: "1.4em" }}>ID - {player.id}</span>
            </Tooltip>
          </p>
        ) : (
          <></>
        )}

        <TextFormField field="name" label="Name" />

        <RegionSelectionDropdownField field="regionId" label="Region" />

        <DateFormField field="joinedDate" label="Joined Date" />

        <DateFormField field="lastActivity" label="Last Activity" />

        <TextFormField field="alias" label="Alias" />
        <TextFormField field="bio" label="Bio" multiline />
        <TextFormField field="pronouns" label="Pronouns" />
      </Form>
    </div>
  );
};

export default AdminPlayerModule;
