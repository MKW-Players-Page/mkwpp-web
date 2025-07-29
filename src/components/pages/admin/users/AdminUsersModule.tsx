import { Tooltip } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AdminUser } from "../../../../api";

import Form, { FormState, TextFormField, SwitchFormField } from "../../../widgets/Form";
import { PlayerSelectDropdownField } from "../../../widgets/PlayerSelectDropdown";

export interface AdminUserModuleProps {
  user?: AdminUser;
}

interface AdminUserModuleState extends FormState {
  username: string;
  password: string;
  email: string;
  isStaff: boolean;
  isActive: boolean;
  isVerified: boolean;
  playerId?: number;
}

const AdminUserModule = ({ user }: AdminUserModuleProps) => {
  const initialState: AdminUserModuleState = {
    username: user?.username ?? "",
    password: "",
    email: user?.email ?? "",
    isStaff: user?.isStaff ?? false,
    isActive: user?.isActive ?? false,
    isVerified: user?.isVerified ?? false,
    playerId: user?.playerId,
    errors: {},
    submitting: false,
  };

  const navigate = useNavigate();
  const [state, setState] = useState<AdminUserModuleState>(initialState);

  const apiFunction = user
    ? async () =>
        AdminUser.editUser(
          user.id,
          state.username,
          state.password,
          state.email,
          state.isStaff,
          state.isActive,
          state.isVerified,
          state.playerId,
        )
    : async () =>
        AdminUser.insertUser(
          state.username,
          state.password,
          state.email,
          state.isStaff,
          state.isActive,
          state.isVerified,
          state.playerId,
        );

  const submit = () =>
    apiFunction()
      .then(() => {
        setState({ ...initialState });
        navigate(0);
      })
      .catch((error) => {
        setState((prev) => ({ ...prev, errors: error, submitting: false }));
      });

  return (
    <div className="module-content">
      <Form
        submit={submit}
        state={state}
        setState={setState}
        title="Users Editor"
        submitLabel="Save"
        extraButtons={
          user ? (
            <div
              onClick={() => {
                AdminUser.deleteUser(user.id).then(() => navigate(0));
              }}
              className="submit-style"
            >
              Delete
            </div>
          ) : undefined
        }
      >
        {user ? (
          <p>
            <Tooltip title={"This should not be modified while the server is running."}>
              <span style={{ fontWeight: "700", fontSize: "1.4em" }}>ID - {user.id}</span>
            </Tooltip>
          </p>
        ) : (
          <></>
        )}

        <TextFormField field="username" label="Username" />
        <TextFormField
          password
          field="password"
          label="Reset Password"
          helperText="Setting this will reset the password for the player"
        />
        <TextFormField field="email" label="Email" />
        <div className="module-row">
          <SwitchFormField
            defaultChecked={state.isVerified}
            field="isVerified"
            label="Is Verified"
          />
          <SwitchFormField defaultChecked={state.isActive} field="isActive" label="Is Active" />
          <SwitchFormField defaultChecked={state.isStaff} field="isStaff" label="Is Staff" />
        </div>
        <PlayerSelectDropdownField field="playerId" label="Associated Player" />
      </Form>
    </div>
  );
};

export default AdminUserModule;
