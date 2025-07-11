import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminUser } from "../../../../api";
import { Tooltip } from "../../../widgets";

import Form, { FormState, Field } from "../../../widgets/Form";
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
      .then((r) => {
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
                AdminUser.deleteUser(user.id).then((r) => navigate(0));
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
            <Tooltip text={"This should not be modified while the server is running."} left>
              <span style={{ fontWeight: "700", fontSize: "1.4em" }}>ID - {user.id}</span>
            </Tooltip>
          </p>
        ) : (
          <></>
        )}

        <Field type="text" field="username" label="Username" />
        <Field type="text" field="password" label="Reset Password" />
        <Field type="text" field="email" label="Email" />
        <Field
          defaultChecked={state.isVerified}
          type="checkbox"
          field="isVerified"
          label="Is Verified"
        />
        <Field defaultChecked={state.isActive} type="checkbox" field="isActive" label="Is Active" />
        <Field defaultChecked={state.isStaff} type="checkbox" field="isStaff" label="Is Staff" />
        <PlayerSelectDropdownField field="playerId" label="Associated Player" hideNoneValue />
      </Form>
    </div>
  );
};

export default AdminUserModule;
