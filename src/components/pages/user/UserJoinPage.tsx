import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages, resolvePage } from '../Pages';
import Form, { Field } from '../../widgets/Form';
import { coreApi } from '../../../api';
import { ResponseError } from '../../../api/generated';

interface UserJoinState {
  email: string;
  username: string;
  password: string;
  password2: string;
  errors: { [key: string]: string[] };
};

const UserJoinPage = () => {
  const navigate = useNavigate();

  const initialState = { email: "", username: "", password: "", password2: "", errors: {} };
  const [state, setState] = useState<UserJoinState>(initialState);

  const submit = () => {
    setState((prev) => ({ ...prev, errors: {} }));

    if (state.password !== state.password2) {
      setState((prev) => ({
        ...prev,
        errors: {
          password2: ["Password does not match."],
        },
      }));

      return;
    }

    coreApi.createUser({
      user: { username: state.username, email: state.email, password: state.password }
    }).then(() => {
      navigate(resolvePage(Pages.UserJoinSuccess));
    }).catch((error: ResponseError) => {
      error.response.json().then((json) => {
        setState((prev) => ({
          ...prev,
          errors: { ...json },
        }));
      });
    });
  };

  return (
    <>
      <Form state={state} setState={setState} title="Join" submitLabel="Join" submit={submit}>
        <Field type="email" field="email" label="Email" />
        <Field type="text" field="username" label="Username" />
        <Field type="password" field="password" label="Password" />
        <Field type="password" field="password2" label="Confirm Password" />
      </Form>
    </>
  );
};

export const UserJoinSuccessPage = () => {
  return (
    <>
      <h1>Account Created</h1>
      <div className="module">
        <div className="module-content">
          <p>
            Your account has been successfully created! A verification email has been sent to the
            address you provided.
          </p>
          <p>
            The activation link for your account will expire in 48 hours. Make sure to follow it
            before then, as you will have to recreate your account otherwise!
          </p>
          <p>
            Thank you for joining the Players' Page!
          </p>
        </div>
      </div>
    </>
  );
};

export default UserJoinPage;
