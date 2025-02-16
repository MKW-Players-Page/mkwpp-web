import { useContext, useState } from "react";

import { coreApi } from "../../../api";
import { ResponseError } from "../../../api/generated";
import { I18nContext, translate } from "../../../utils/i18n/i18n";
import Form, { Field, FormState } from "../../widgets/Form";

interface UserPasswordResetFormState extends FormState {
  email: string;
}

interface UserPasswordResetFormProps {
  closeForm: () => void;
}

const UserPasswordResetForm = ({ closeForm }: UserPasswordResetFormProps) => {
  const { lang } = useContext(I18nContext);

  const initialState = { email: "", errors: {}, submitting: false };
  const [state, setState] = useState<UserPasswordResetFormState>(initialState);

  const submit = (done: () => void) => {
    coreApi
      .corePasswordResetRequestCreate({ passwordResetRequest: { email: state.email } })
      .then(closeForm)
      .catch((error: ResponseError) => {
        error.response.json().then((json) => {
          setState((prev) => ({ ...prev, errors: { ...json } }));
        });
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
        type="email"
        field="email"
        label={translate("userPasswordForgotPageEmailLabel", lang)}
      />
    </Form>
  );
};

const UserPasswordForgotPage = () => {
  const { lang } = useContext(I18nContext);

  const [showForm, setShowForm] = useState<boolean>(true);

  return showForm ? (
    <UserPasswordResetForm closeForm={() => setShowForm(false)} />
  ) : (
    <>
      <h1>{translate("userPasswordForgotPageHeading", lang)}</h1>
      <div className="module">
        <div className="module-content">
          {translate("userPasswordForgotPageContentSuccess", lang)}
        </div>
      </div>
    </>
  );
};

export default UserPasswordForgotPage;
