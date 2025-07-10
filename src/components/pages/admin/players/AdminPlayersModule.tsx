import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminPlayer } from "../../../../api";
import { secondsToDate } from "../../../../utils/DateUtils";
import { formatDate } from "../../../../utils/Formatters";
import { mkwReleaseDate } from "../../../../utils/Numbers";
import { Tooltip } from "../../../widgets";

import Form, { FormState, Field } from "../../../widgets/Form";
import { RegionSelectionDropdownField } from "../../../widgets/RegionDropdown";

export interface AdminPlayerModuleProps {
  player?: AdminPlayer;
}

interface AdminPlayerModuleState extends FormState {
  name: string;
  regionId: number;
  joinedDate: Date;
  lastActivity: Date;
  submitters: Array<number>;
  alias?: string;
  bio?: string;
  pronouns?: string;
}

const AdminPlayerModule = ({ player }: AdminPlayerModuleProps) => {
  const initialState: AdminPlayerModuleState = {
    name: player?.name ?? "",
    regionId: player?.regionId ?? 1,
    joinedDate: player ? secondsToDate(player.joinedDate) : new Date(mkwReleaseDate),
    lastActivity: player ? secondsToDate(player.lastActivity) : new Date(mkwReleaseDate),
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
          state.joinedDate,
          state.lastActivity,
          state.submitters,
          state.alias !== "" ? state.alias : undefined,
          state.bio !== "" ? state.bio : undefined,
          state.pronouns !== "" ? state.pronouns : undefined,
        )
    : async () =>
        AdminPlayer.insertPlayer(
          state.name,
          state.regionId,
          state.joinedDate,
          state.lastActivity,
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
            <Tooltip text={"This should not be modified while the server is running."} left>
              <span style={{ fontWeight: "700", fontSize: "1.4em" }}>ID - {player.id}</span>
            </Tooltip>
          </p>
        ) : (
          <></>
        )}

        <Field type="text" field="name" label="Name" />

        <RegionSelectionDropdownField field="regionId" label="Region" />

        <Field
          type="date"
          field="joinedDate"
          label="Joined Date"
          fromStringFunction={(x) => new Date(Date.parse(x))}
          toStringFunction={formatDate}
        />

        <Field
          type="date"
          field="lastActivity"
          label="Last Activity"
          fromStringFunction={(x) => new Date(Date.parse(x))}
          toStringFunction={formatDate}
        />

        <Field type="text" field="alias" label="Alias" />

        <Field type="text" field="bio" label="Bio" />

        <Field type="text" field="pronouns" label="Pronouns" />
      </Form>
    </div>
  );
};

export default AdminPlayerModule;
