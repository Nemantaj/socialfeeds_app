import { Fragment, memo, useState } from "react";
import {
  Divider,
  Text,
  Button,
  Image,
  Loading,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import FileUpload from "../../components/UI/FileUpload";
import BackSettings from "../../components/UI/BackSettings";

function ProfileImage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  function handleChange(img) {
    if (
      img[0].type === "image/jpeg" ||
      img[0].type === "image/jpg" ||
      img[0].type === "image/png"
    ) {
      setImage(img[0]);
      return setImg(URL.createObjectURL(img[0]));
    }
    console.log(img[0].type);
    dispatch(
      authActions.setErrorData({
        title: "Error Occured",
        msg: "This file type is not supported!",
      })
    );
    return dispatch(authActions.setPopOpen());
  }

  function setProfileImage() {
    setLoading(true);
    const formData = new FormData();
    formData.append("img", image);

    fetch("https://socialfeedsapp.herokuapp.com/user/change-profile-image/" + userId, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
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
              title: "Error Occured",
              msg: "An error occured while trying to retrive user information.",
            })
          );
          return dispatch(authActions.setPopOpen());
        }
        dispatch(authActions.setProfileData(data.userData));
        setImage(null);
        setImg(null);
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

  function setShowcaseImage() {
    setLoading(true);
    const formData = new FormData();
    formData.append("img", image);

    fetch("https://socialfeedsapp.herokuapp.com/user/change-showcase-image/" + userId, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
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
              title: "Error Occured",
              msg: "An error occured while trying to retrive user information.",
            })
          );
          return dispatch(authActions.setPopOpen());
        }
        dispatch(authActions.setProfileData(data.userData));
        setImage(null);
        setImg(null);
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

  return (
    <Fragment>
      <div className="settings_home_bar">
        <Text
          color="$pink800"
          size="14px"
          css={{ bgColor: "$pink300", br: "20px", py: "5px", px: "10px" }}
        >
          {location.pathname === "/settings/main/change-profile"
            ? "Change profile picture."
            : "Change showcase image."}
        </Text>
        <BackSettings />
      </div>
      <Divider css={{ mw: "550px" }} />
      <div className="settings_profile_img">
        <motion.form
          initial={{ y: "50%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", duration: 0.7 }}
          className="settings_img_form"
        >
          <div className="settings_file">
            <FileUpload onUpload={handleChange} />
            <Text size="14px" css={{ ml: "5px" }}>
              Upload an image.
            </Text>
          </div>
          {img !== null && <Image className="new_img_preview" src={img} />}
        </motion.form>
      </div>
      <div className="settings_action">
        {image && (
          <Button
            size="sm"
            rounded
            flat
            auto
            color="error"
            onClick={
              location.pathname === "/settings/main/change-profile"
                ? setProfileImage
                : setShowcaseImage
            }
          >
            {loading && <Loading type="spinner" />}
            {!loading && "Update"}
          </Button>
        )}
      </div>
    </Fragment>
  );
}

export default memo(ProfileImage);
