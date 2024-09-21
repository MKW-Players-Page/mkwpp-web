import { ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages, resolvePage } from '../Pages';
import { coreApi } from '../../../api';
import { ResponseError } from '../../../api/generated';
import { loginUser, UserContext } from '../../../utils/User';

interface UserLoginState {
  username: string;
  password: string;
  error?: string;
};

const UserLoginPage = () => {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const initialState = { username: "", password: "" };
  const [state, setState] = useState<UserLoginState>(initialState);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = () => {
    coreApi.login({
      auth: { username: state.username, password: state.password }
    }).then((auth) => {
      loginUser(setUser, auth);
      navigate(resolvePage(Pages.Home));
    }).catch((reason: ResponseError) => {
      if (reason.response) {
        reason.response.json().then((json) => {
          const error = json['non_field_errors'] || "Invalid credentials";
          setState((prev) => ({ ...prev, error }));
        });
      }
    });
  };

  return (
    <>
      <h1>Log In</h1>
      {state.error && <b>{state.error}</b>}
      <p>Username</p>
      <input type="text" name="username" value={state.username} onChange={onInputChange} />
      <p>Password</p>
      <input type="password" name="password" value={state.password} onChange={onInputChange} />
      <br />
      <button onClick={submit}>Log In</button>
    </>
  );
};

export default UserLoginPage;
