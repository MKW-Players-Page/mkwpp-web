import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { coreApi } from "../../../api";
import { ResponseError } from "../../../api/generated";
import Deferred from "../../global/Deferred";
import { Pages, resolvePage } from "../Pages";

interface UserActivationState {
  isLoading: boolean;
  error?: string;
}

const UserActivationPage = () => {
  const [query] = useSearchParams();

  const token = query.get("token");

  const initialState = { isLoading: true };
  const [state, setState] = useState<UserActivationState>(initialState);

  useEffect(() => {
    if (!token) {
      setState({
        isLoading: false,
        error: "The activation link is missing a verification token!",
      });
    } else {
      coreApi
        .coreVerifyCreate({ verificationToken: { token } })
        .then(() => {
          setState({ isLoading: false });
        })
        .catch((error: ResponseError) => {
          error.response
            .json()
            .then((json) => {
              setState({
                isLoading: false,
                error: json,
              });
            })
            .catch(() => {
              setState({
                isLoading: false,
                error: "Something went wrong. Please contact an administrator.",
              });
            });
        });
    }
  }, [token]);

  return (
    <Deferred isWaiting={state.isLoading}>
      {state.error ? (
        <>
          <h1>Account verification failed</h1>
          <div className="module">
            <div className="module-content">{state.error}</div>
          </div>
        </>
      ) : (
        <>
          <h1>Your account has been activated!</h1>
          <div className="module">
            <div className="module-content">
              You may now{" "}
              <b>
                <Link to={resolvePage(Pages.UserLogin)}>log in</Link>
              </b>
              .
            </div>
          </div>
        </>
      )}
    </Deferred>
  );
};

export default UserActivationPage;
