import { Fragment, useState, memo } from "react";
import {
  Divider,
  Text,
  Button,
  Input,
  Loading,
  Textarea,
} from "@nextui-org/react";
import { TbPencil, TbBriefcase } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authActions } from "../../store/auth-slice";

import useInput from "../../hooks/useInput";
import ErrorMessage from "../../components/auth/ErrorMessage";
import BackSettings from "../../components/UI/BackSettings";

function ChangeUserBio() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const {
    inputValue: bioValue,
    error: bioError,
    isValid: bioValid,
    inputHandler: bioHandler,
    blurHandler: bioBlur,
  } = useInput((value) => value !== "" && value.length <= 100);

  const {
    inputValue: workValue,
    error: workError,
    isValid: workValid,
    inputHandler: workHandler,
    blurHandler: workBlur,
  } = useInput((value) => value !== "" && value.length <= 15);

  function changeUserBio() {
    if (bioValid) {
      setLoading(true);
      fetch("https://socialfeedsapp.herokuapp.com/user/change-user-bio/" + userId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          newBio: bioValue,
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

  function changeUserWork() {
    if (workValid) {
      setLoading(true);
      fetch("https://socialfeedsapp.herokuapp.com/user/change-user-work/" + userId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          newWork: workValue,
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
          color="$green800"
          size="14px"
          css={{
            bgColor: "$green300",
            br: "20px",
            py: "5px",
            px: "10px",
          }}
        >
          Change your bio and work.
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
          <Text
            color="$green800"
            size="14px"
            css={{
              w: "100%",
              textAlign: "start",
              mb: "10px",
              px: "10px",
              py: "5px",
              border: "1px solid",
              borderColor: "$green800",
              w: "fit-content",
              br: "20px",
            }}
          >
            Update your bio
          </Text>
          <Textarea
            bordered
            type="text"
            placeholder="Your bio should be under or equal to 100 characters."
            css={{ w: "100%" }}
            contentLeft={<TbPencil />}
            onChange={bioHandler}
            onBlur={bioBlur}
            aria-label="Enter bio here!"
          />
          {bioError && (
            <ErrorMessage text="Your bio should be under or equal to 100 characters." />
          )}
          <Button
            size="sm"
            css={{ mt: "10px" }}
            rounded
            flat
            auto
            color="error"
            onClick={changeUserBio}
          >
            {loading && <Loading type="spinner" />}
            {!loading && "Update"}
          </Button>
        </motion.form>
      </div>
      <Divider css={{ mw: "550px" }} />
      <div className="settings_profile_img">
        <motion.form
          initial={{ y: "50%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="settings_info_form"
        >
          <Text
            color="$green800"
            size="14px"
            css={{
              w: "100%",
              textAlign: "start",
              mb: "10px",
              px: "10px",
              py: "5px",
              border: "1px solid",
              borderColor: "$green800",
              w: "fit-content",
              br: "20px",
              mt: "10px",
            }}
          >
            Update your work
          </Text>
          <Input
            bordered
            type="text"
            placeholder="Enter new work..."
            css={{ w: "100%" }}
            contentLeft={<TbBriefcase />}
            onChange={workHandler}
            onBlur={workBlur}
            aria-label="Enter work here!"
            clearable
          />
          {workError && <ErrorMessage text="Work is required!" />}
          <Button
            size="sm"
            css={{ mt: "10px" }}
            rounded
            flat
            auto
            color="error"
            onClick={changeUserWork}
          >
            {loading && <Loading type="spinner" />}
            {!loading && "Update"}
          </Button>
        </motion.form>
      </div>
    </Fragment>
  );
}

export default memo(ChangeUserBio);
