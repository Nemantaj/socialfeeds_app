import { Fragment, useState, memo } from "react";
import { Divider, Text, Button, Input, Loading } from "@nextui-org/react";
import { TbUser } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authActions } from "../../store/auth-slice";

import useInput from "../../hooks/useInput";
import ErrorMessage from "../../components/auth/ErrorMessage";
import BackSettings from "../../components/UI/BackSettings";

function ChangeUserInfo() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const {
    inputValue: fnameValue,
    error: fnameError,
    isValid: fnameValid,
    inputHandler: fnameHandler,
    blurHandler: fnameBlur,
  } = useInput((value) => value !== "");

  const {
    inputValue: lnameValue,
    error: lnameError,
    isValid: lnameValid,
    inputHandler: lnameHandler,
    blurHandler: lnameBlur,
  } = useInput((value) => value !== "");

  function changeUserInfo() {
    if (fnameValid && lnameValid) {
      setLoading(true);
      fetch("https://socialfeedsapp.herokuapp.com/user/change-user-info/" + userId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          fname: fnameValue,
          lname: lnameValue,
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
          if (!data.userData) {
            dispatch(
              authActions.setErrorData({
                title: "Error occured!",
                msg: "An error occured while trying to change user info!",
              })
            );
            setLoading(false);
            return dispatch(authActions.setPopOpen());
          }
          dispatch(authActions.setProfileData(data.userData));
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
          color="$cyan800"
          size="14px"
          css={{ bgColor: "$cyan300", br: "20px", py: "5px", px: "10px" }}
        >
          Change user info.
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
          <Input
            bordered
            type="text"
            placeholder="Enter new first name..."
            css={{ w: "100%" }}
            contentLeft={<TbUser />}
            onChange={fnameHandler}
            onBlur={fnameBlur}
            aria-label="First name"
            clearable
          />
          {fnameError && <ErrorMessage text="First name is required!" />}
          <Input
            bordered
            type="text"
            placeholder="Enter new last name..."
            css={{ w: "100%", mt: "10px" }}
            contentLeft={<TbUser />}
            onChange={lnameHandler}
            onBlur={lnameBlur}
            aria-label="Last name"
            clearable
          />
          {lnameError && <ErrorMessage text="Last name is required!" />}
          <Button
            size="sm"
            css={{ mt: "10px" }}
            rounded
            flat
            auto
            color="error"
            onClick={changeUserInfo}
          >
            {loading && <Loading type="spinner" />}
            {!loading && "Update"}
          </Button>
        </motion.form>
      </div>
    </Fragment>
  );
}

export default memo(ChangeUserInfo);
