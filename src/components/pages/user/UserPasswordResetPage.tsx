import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { coreApi } from "../../../api";
import { ResponseError } from "../../../api/generated";
import { I18nContext, translate } from "../../../utils/i18n/i18n";
import Deferred from "../../widgets/Deferred";
import Form, { Field, FormState } from "../../widgets/Form";

interface UserPasswordResetFormState extends FormState {
  password: string;
  password2: string;
}

interface UserPasswordResetFormProps {
  token: string;
  closeForm: (title: string, content: string) => void;
}

const UserPasswordResetForm = ({ token, closeForm }: UserPasswordResetFormProps) => {
  const { lang } = useContext(I18nContext);

  const initialState = { password: "", password2: "", errors: {}, submitting: false };
  const [state, setState] = useState<UserPasswordResetFormState>(initialState);

  const submit = (done: () => void) => {
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
      .corePasswordResetCreate({ passwordReset: { token, password: state.password } })
      .then(() => {
        closeForm(
          translate("userPasswordResetPageResultTitleSuccess", lang),
          translate("userPasswordResetPageResultContentSuccess", lang),
        );
      })
      .catch((error: ResponseError) => {
        if (error.response.status === 400) {
          error.response.json().then((json) => {
            setState((prev) => ({ ...prev, errors: { ...json } }));
          });
        } else {
          closeForm(
            translate("userPasswordResetPageResultTitleFailure", lang),
            translate("userPasswordResetPageResultContentUnknownError", lang),
          );
        }
      })
      .finally(done);
  };

  return (
    <Form
      state={state}
      setState={setState}
      title={translate("userPasswordResetPageHeading", lang)}
      submitLabel={translate("userPasswordResetPageSubmitLabel", lang)}
      submit={submit}
    >
      <Field
        type="password"
        field="password"
        label={translate("userPasswordResetPagePasswordLabel", lang)}
      />
      <Field
        type="password"
        field="password2"
        label={translate("userPasswordResetPagePassword2Label", lang)}
      />
    </Form>
  );
};

interface UserPasswordResetState {
  isLoading: boolean;
  showForm: boolean;
  title?: string;
  content?: string;
}

const UserPasswordResetPage = () => {
  const [query] = useSearchParams();

  const token = query.get("token");

  const { lang } = useContext(I18nContext);

  const initialState = { isLoading: true, showForm: false };
  const [state, setState] = useState<UserPasswordResetState>(initialState);

  useEffect(() => {
    const tokenVerificationFailed = (detail?: string) => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        showForm: false,
        title: translate("userPasswordResetPageResultTitleVerificationFailed", lang),
        content: detail ?? translate("userPasswordResetPageResultContentUnknownError", lang),
      }));
    };

    if (token) {
      coreApi
        .corePasswordResetVerifyCreate({ token: { token } })
        .then(() => setState((prev) => ({ ...prev, isLoading: false, showForm: true })))
        .catch((error: ResponseError) => {
          error.response
            .json()
            .then((json) => tokenVerificationFailed(json.detail))
            .catch(tokenVerificationFailed);
        });
    } else {
      tokenVerificationFailed(translate("userPasswordResetPageResultTitleMissingToken", lang));
    }
  }, [lang, token]);

  const closeForm = (title: string, content: string) => {
    setState((prev) => ({ ...prev, showForm: false, title, content }));
  };

  return (
    <Deferred isWaiting={state.isLoading}>
      {state.showForm ? (
        <UserPasswordResetForm token={token ?? ""} closeForm={closeForm} />
      ) : (
        <>
          <h1>{translate("userPasswordResetPageHeading", lang)}</h1>
          <div className="module">
            <div className="module-content">
              <h3>{state.title}</h3>
              <p>{state.content}</p>
            </div>
          </div>
        </>
      )}
    </Deferred>
  );
};

export default UserPasswordResetPage;
