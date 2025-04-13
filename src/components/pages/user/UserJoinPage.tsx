import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router";

import { Pages, resolvePage } from "../Pages";
import Form, { Field } from "../../widgets/Form";
import { coreApi } from "../../../api";
import { ResponseError } from "../../../api/generated";
import { UserContext } from "../../../utils/User";
import { I18nContext, translate } from "../../../utils/i18n/i18n";

interface UserJoinState {
  email: string;
  username: string;
  password: string;
  password2: string;
  errors: { [key: string]: string[] };
  submitting: boolean;
}

const UserJoinPage = () => {
  const navigate = useNavigate();

  const initialState = {
    email: "",
    username: "",
    password: "",
    password2: "",
    errors: {},
    submitting: false,
  };
  const [state, setState] = useState<UserJoinState>(initialState);

  const { user } = useContext(UserContext);
  const { lang } = useContext(I18nContext);

  const submit = (done: () => void) => {
    setState((prev) => ({ ...prev, errors: {} }));

    if (state.password !== state.password2) {
      setState((prev) => ({
        ...prev,
        errors: {
          password2: ["Password does not match."],
        },
      }));

      done();
      return;
    }

    coreApi
      .coreSignupCreate({
        user: { username: state.username, email: state.email, password: state.password },
      })
      .then(() => {
        navigate(resolvePage(Pages.UserJoinSuccess));
        done();
      })
      .catch((error: ResponseError) => {
        error.response.json().then((json) => {
          setState((prev) => ({
            ...prev,
            errors: { ...json },
          }));
        });
        done();
      });
  };

  return (
    <>
      {/* Redirect users to home page if they are already logged in. */}
      {user && <Navigate to={resolvePage(Pages.Home)} />}
      <Form
        state={state}
        setState={setState}
        title={translate("userJoinPageFormLabel", lang)}
        submitLabel={translate("userJoinPageFormLabelSubmitButton", lang)}
        submit={submit}
      >
        <Field type="email" field="email" label={translate("userJoinPageEmailLabel", lang)} />
        <Field type="text" field="username" label={translate("userJoinPageUsernameLabel", lang)} />
        <Field
          type="password"
          field="password"
          label={translate("userJoinPagePasswordLabel", lang)}
        />
        <Field
          type="password"
          field="password2"
          label={translate("userJoinPageConfirmPasswordLabel", lang)}
        />
      </Form>
    </>
  );
};

export const UserJoinSuccessPage = () => {
  const { lang } = useContext(I18nContext);
  return (
    <>
      <h1>{translate("userJoinPageSuccessHeading", lang)}</h1>
      <div className="module">
        <div className="module-content">
          <p>{translate("userJoinPageParagraph1", lang)}</p>
          <p>{translate("userJoinPageParagraph2", lang)}</p>
          <p>{translate("userJoinPageParagraph3", lang)}</p>
        </div>
      </div>
    </>
  );
};

export default UserJoinPage;
