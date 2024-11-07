import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Pages, resolvePage } from "../Pages";
import Form, { Field } from "../../widgets/Form";
import { coreApi } from "../../../api";
import { ResponseError } from "../../../api/generated";
import { UserContext } from "../../../utils/User";
import { I18nContext } from "../../../utils/i18n/i18n";

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
  const { translations, lang } = useContext(I18nContext);

  const submit = (done: () => void) => {
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
        title={translations.userJoinPageFormLabel[lang]}
        submitLabel={translations.userJoinPageFormLabelSubmitButton[lang]}
        submit={submit}
      >
        <Field type="email" field="email" label={translations.userJoinPageEmailLabel[lang]} />
        <Field type="text" field="username" label={translations.userJoinPageUsernameLabel[lang]} />
        <Field
          type="password"
          field="password"
          label={translations.userJoinPagePasswordLabel[lang]}
        />
        <Field
          type="password"
          field="password2"
          label={translations.userJoinPageConfirmPasswordLabel[lang]}
        />
      </Form>
    </>
  );
};

export const UserJoinSuccessPage = () => {
  const { translations, lang } = useContext(I18nContext);
  return (
    <>
      <h1>{translations.userJoinPageSuccessHeading[lang]}</h1>
      <div className="module">
        <div className="module-content">
          <p>{translations.userJoinPageParagraph1[lang]}</p>
          <p>{translations.userJoinPageParagraph2[lang]}</p>
          <p>{translations.userJoinPageParagraph3[lang]}</p>
        </div>
      </div>
    </>
  );
};

export default UserJoinPage;
