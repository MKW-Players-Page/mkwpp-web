import { useContext, useState } from "react";

import { User } from "../../../api";
import { I18nContext, translate } from "../../../utils/i18n/i18n";
import { UserContext } from "../../../utils/User";
import Form, { FormState, TextFormField } from "../Form";

interface AccountPasswordChangeFormState extends FormState {
  old_password: string;
  new_password: string;
  new_password2: string;
}

const AccountPasswordChangeForm = () => {
  const { lang } = useContext(I18nContext);
  const { user } = useContext(UserContext);

  const initialState = {
    old_password: "",
    new_password: "",
    new_password2: "",
    errors: {},
    submitting: false,
  };
  const [state, setState] = useState<AccountPasswordChangeFormState>(initialState);
  const [success, setSuccess] = useState<boolean>(false);

  const submit = (done: () => void) => {
    setSuccess(false);

    if (state.new_password !== state.new_password2) {
      setState((prev) => ({
        ...prev,
        errors: { new_password2: ["Password does not match."] },
      }));

      done();
      return;
    }

    User.passwordChange(user?.userId ?? 0, state.old_password, state.new_password)
      .then(() => {
        setState(initialState);
        setSuccess(true);
      })
      .catch((error) => {
        setState((prev) => ({ ...prev, errors: error }));
        done();
      });
  };

  return (
    <>
      {success && (
        <p className="form-success">{translate("optionsPageAccountOptPasswordSuccess", lang)}</p>
      )}
      <Form
        state={state}
        setState={setState}
        submitLabel={translate("optionsPageSaveBtnText", lang)}
        submit={submit}
      >
        <TextFormField
          password
          field="old_password"
          label={translate("optionsPageAccountOptPasswordLabelOldPassword", lang)}
        />
        <TextFormField
          password
          field="new_password"
          label={translate("optionsPageAccountOptPasswordLabelNewPassword", lang)}
        />
        <TextFormField
          password
          field="new_password2"
          label={translate("optionsPageAccountOptPasswordLabelConfirmNewPassword", lang)}
        />
      </Form>
    </>
  );
};

export default AccountPasswordChangeForm;
