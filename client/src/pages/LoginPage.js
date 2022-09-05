import SignUpCard from "../components/auth/NewAccount";
import LoginCard from "../components/auth/Login";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";

import "./LoginPage.css";

function LoginPage() {
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  function acModSwitcher() {
    setLogin(!login);
  }

  function authHandler(userInfo) {
    setLoading(true);

    console.log(JSON.stringify(userInfo));

    fetch("https://socialfeedsapp.herokuapp.com/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return res.json();
      })
      .then((data) => {
        dispatch(authActions.setErrorData(data));
        dispatch(authActions.setPopOpen());
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  function loginHandler(userInfo) {
    setLoading(true);

    console.log(JSON.stringify(userInfo));

    fetch("https://socialfeedsapp.herokuapp.com/login", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return res.json();
      })
      .then((data) => {
        if (data.message) {
          dispatch(authActions.setErrorData(data.message));
        } else {
          dispatch(authActions.setErrorData(data));
        }
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        dispatch(authActions.setPopOpen());
        setLoading(false);
        if (data.userId) {
          dispatch(authActions.setToken(data.token));
          dispatch(authActions.setUserId(data.userId));
          dispatch(authActions.setAuth());
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("expires", expiryDate.toISOString());
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <Fragment>
      <div className="login_page_styles">
        {login && (
          <LoginCard
            onAccount={acModSwitcher}
            isLoading={loading}
            loginHandle={loginHandler}
          />
        )}
        {!login && (
          <SignUpCard
            onAccount={acModSwitcher}
            isLoading={loading}
            authHandle={authHandler}
          />
        )}
      </div>
    </Fragment>
  );
}

export default LoginPage;
