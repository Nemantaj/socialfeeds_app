import { Fragment, useState, memo } from "react";
import { Divider, Text, Button, Input, Loading } from "@nextui-org/react";
import { TbLock, TbLockAccess, TbEye, TbEyeOff } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authActions } from "../../store/auth-slice";

import useInput from "../../hooks/useInput";
import ErrorMessage from "../../components/auth/ErrorMessage";
import BackSettings from "../../components/UI/BackSettings";

function ChangePassword() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const {
    inputValue: oldPassValue,
    error: oldPassError,
    isValid: oldPassValid,
    inputHandler: oldPassHandler,
    blurHandler: oldPassBlur,
  } = useInput((value) => value !== "" && value.length >= 8);

  const {
    inputValue: newPassValue,
    error: newPassError,
    isValid: newPassValid,
    inputHandler: newPassHandler,
    blurHandler: newPassBlur,
  } = useInput((value) => value !== "" && value.length >= 8);

  const {
    inputValue: cNewPassValue,
    error: cNewPassError,
    isValid: cNewPassValid,
    inputHandler: cNewPassHandler,
    blurHandler: cNewPassBlur,
  } = useInput((value) => value !== "" && value === newPassValue);

  function changePassword() {
    if (oldPassValid && newPassValid && cNewPassValid) {
      setLoading(true);
      fetch("https://socialfeedsapp.herokuapp.com/user/change-password/" + userId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          oldPass: oldPassValue,
          newPass: newPassValue,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            dispatch(
              authActions.setErrorData({
                title: "Error Occured",
                msg: "An error occured while trying to retrive user information.",
              })
            );
            return dispatch(authActions.setPopOpen());
          }
          return res.json();
        })
        .then((data) => {
          if (!data.success) {
            dispatch(
              authActions.setErrorData({
                title: "Error occured!",
                msg: "Check if your old password is correct and please try again!",
              })
            );
            setLoading(false);
            return dispatch(authActions.setPopOpen());
          }
          setLoading(false);
          navigate("/settings/main");
          dispatch(authActions.setErrorData(data.message));
          return dispatch(authActions.setPopOpen());
        })
        .catch((err) => {
          dispatch(
            authActions.setErrorData({
              title: "Error Occured",
              msg: "An error occured while trying to retrive user information.",
            })
          );
          dispatch(authActions.setPopOpen());
          setLoading(false);
        });
    }
  }

  return (
    <Fragment>
      <div className="settings_home_bar">
        <Text
          color="$red600"
          size="14px"
          css={{ bgColor: "$red300", br: "20px", py: "5px", px: "10px" }}
        >
          Change your password.
        </Text>
        <BackSettings />
      </div>
      <Divider css={{ mw: "550px" }} />
      <div className="settings_profile_img">
        <motion.form
          initial={{ y: "50%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 0.7 }}
          className="settings_info_form"
        >
          <Input.Password
            bordered
            type="password"
            placeholder="Enter your old password..."
            css={{ w: "100%" }}
            contentLeft={<TbLock />}
            onChange={oldPassHandler}
            onBlur={oldPassBlur}
            aria-label="Old password"
            clearable
            visibleIcon={<TbEyeOff />}
            hiddenIcon={<TbEye />}
          />
          {oldPassError && (
            <ErrorMessage text="Password should atleast be 8 characters." />
          )}
          <Input.Password
            bordered
            type="password"
            placeholder="Enter new password..."
            css={{ w: "100%", mt: "10px" }}
            contentLeft={<TbLockAccess />}
            onChange={newPassHandler}
            onBlur={newPassBlur}
            aria-label="New password"
            clearable
            visibleIcon={<TbEyeOff />}
            hiddenIcon={<TbEye />}
          />
          {newPassError && (
            <ErrorMessage text="Password should atleast be 8 characters." />
          )}
          <Input.Password
            bordered
            type="password"
            placeholder="Confirm new password..."
            css={{ w: "100%", mt: "10px" }}
            contentLeft={<TbLockAccess />}
            onChange={cNewPassHandler}
            onBlur={cNewPassBlur}
            aria-label="Confirm new password"
            clearable
            visibleIcon={<TbEyeOff />}
            hiddenIcon={<TbEye />}
          />
          {cNewPassError && (
            <ErrorMessage text="Please confirm your new password!." />
          )}
          <Button
            size="sm"
            css={{ mt: "10px" }}
            rounded
            flat
            auto
            color="error"
            onClick={changePassword}
          >
            {loading && <Loading type="spinner" />}
            {!loading && "Update"}
          </Button>
        </motion.form>
      </div>
    </Fragment>
  );
}

export default memo(ChangePassword);
