import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Pages, resolvePage } from "../Pages";
import { coreApi } from "../../../api";
import { ResponseError } from "../../../api/generated";
import { loginUser, UserContext } from "../../../utils/User";
import Form, { Field } from "../../widgets/Form";

interface UserLoginState {
  username: string;
  password: string;
  errors: { [key: string]: string[] };
  submitting: boolean;
}

const UserLoginPage = () => {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const initialState = { username: "", password: "", errors: {}, submitting: false };
  const [state, setState] = useState<UserLoginState>(initialState);

  const submit = (done: () => void) => {
    coreApi.coreLoginCreate({
      auth: { username: state.username, password: state.password }
    }).then((auth) => {
      loginUser(setUser, auth);
      navigate(resolvePage(Pages.Home));
      done();
    }).catch((reason: ResponseError) => {
      if (reason.response) {
        reason.response.json().then((json) => {
          setState((prev) => ({ ...prev, errors: { ...json } }));
        });
      }
      done();
    });
  };

  return (
    <>
      {/* Redirect users to home page if they are already logged in. */}
      {user && <Navigate to={resolvePage(Pages.Home)} />}
      <Form state={state} setState={setState} title="Log In" submitLabel="Log In" submit={submit}>
        <Field type="text" field="username" label="Username" />
        <Field type="password" field="password" label="Password" />
      </Form>
    </>
  );
};

export default UserLoginPage;
