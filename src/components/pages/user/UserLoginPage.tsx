import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Pages, resolvePage } from "../Pages";
import { loginUser, UserContext } from "../../../utils/User";
import Form, { Field } from "../../widgets/Form";
import { I18nContext, translate } from "../../../utils/i18n/i18n";
import { User } from "../../../api";

interface UserLoginState {
  username: string;
  password: string;
  errors: { [key: string]: string[] };
  submitting: boolean;
}

const UserLoginPage = () => {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);
  const { lang } = useContext(I18nContext);

  const initialState = { username: "", password: "", errors: {}, submitting: false };
  const [state, setState] = useState<UserLoginState>(initialState);

  const submit = (done: () => void) => {
    User.login(state.username, state.password)
      .then((auth) => {
        loginUser(setUser, auth);
        navigate(resolvePage(Pages.Home));
        done();
      })
      .catch((error) => {
        setState((prev) => ({ ...prev, errors: error }));
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
        title={translate("userLoginPageFormLabel", lang)}
        submitLabel={translate("userLoginPageFormLabelSubmitButton", lang)}
        submit={submit}
      >
        <Field type="text" field="username" label={translate("userLoginPageUsernameLabel", lang)} />
        <Field
          type="password"
          field="password"
          label={translate("userLoginPagePasswordLabel", lang)}
        />
        <Link to={resolvePage(Pages.UserPasswordForgot)}>
          {translate("userLoginPageForgotPassword", lang)}
        </Link>
      </Form>
    </>
  );
};

export default UserLoginPage;
