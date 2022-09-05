import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Modal,
  Button,
  Text,
  Image,
  Input,
  Loading,
  Textarea,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { TbArrowBack, TbBriefcase, TbPencil } from "react-icons/tb";
import { authActions } from "../../store/auth-slice";
import useInput from "../../hooks/useInput";
import FileUpload from "../UI/FileUpload";
import ErrorMessage from "./ErrorMessage";

import "../comments/CommentModal.css";
import "./NewUser.css";

function NewUser(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [btnText, setBtnText] = useState("Post");
  const [image, setImage] = useState(null);
  const [error, setError] = useState({
    value: false,
    msg: "",
  });
  const [phase, setPhase] = useState("one");
  const [img, setImg] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const {
    inputValue: workValue,
    error: workError,
    isValid: workValid,
    inputHandler: workHandler,
    blurHandler: workBlur,
  } = useInput((value) => value !== "" && value.length <= 15);

  const {
    inputValue: bioValue,
    error: bioError,
    isValid: bioValid,
    inputHandler: bioHandler,
    blurHandler: bioBlur,
  } = useInput((value) => value.length >= 0 && value.length <= 100);

  function handleChange(img) {
    if (
      img[0].type === "image/jpeg" ||
      img[0].type === "image/jpg" ||
      img[0].type === "image/png"
    ) {
      setError({
        value: false,
        msg: "",
      });
      setImage(img[0]);
      if (btnText !== "Post") {
        setBtnText("Post");
      }
      return setImg(URL.createObjectURL(img[0]));
    }
    console.log(img[0].type);
    return setError({
      value: true,
      msg: "Incorrect file type! Supported file types are 'png' 'jpg' 'jpeg'.",
    });
  }

  console.log(workValue);

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
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data.userData) {
          return setError({
            value: true,
            msg: data.msg,
          });
        }
        dispatch(authActions.setProfileData(data.userData));
        setPhase("two");
        setImage(null);
        setImg(null);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
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
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data.userData) {
          return setError({
            value: true,
            msg: data.msg,
          });
        }
        dispatch(authActions.setProfileData(data.userData));
        setPhase("three");
        setImage(null);
        setImg(null);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  function finishSetupHandler() {
    setLoading(true);
    fetch("https://socialfeedsapp.herokuapp.com/user/finish-setup/" + userId, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newWork: workValue,
        newBio: bioValue,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data.userData) {
          return setError({
            value: true,
            msg: data.msg,
          });
        }
        dispatch(authActions.setProfileData(data.userData));
        setLoading(false);
        props.onClose();
        setPhase("one");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <Modal
      scroll
      fullScreen
      open={props.visible}
      onClose={props.onClose}
      aria-labelledby="Likes Modal"
      className="cmt_modal"
      css={{ h: "100vh" }}
      preventClose
    >
      <Modal.Header className="msg_modal_head">
        <Text h3>Hey, looks like you are new here!</Text>
        <Button auto flat rounded color="primary" size="sm">
          <TbArrowBack onClick={props.onClose} />
        </Button>
      </Modal.Header>
      <Modal.Body className="cmt_modal_body">
        <div className="profile_img_section">
          {phase === "one" && (
            <Fragment>
              {" "}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Text
                  size="15px"
                  color="$pink800"
                  css={{
                    bgColor: "$pink300",
                    br: "20px",
                    py: "5px",
                    px: "10px",
                    w: "fit-content",
                  }}
                >
                  Step 1 : Upload a profile picture.
                </Text>
              </motion.div>
              <motion.form
                initial={{ y: "50%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="profile_img_form"
              >
                <FileUpload onUpload={handleChange} />
                {error.value && <ErrorMessage text={error.msg} />}
                {img !== null && !error.value && (
                  <Image className="new_img_preview" src={img} />
                )}
              </motion.form>
            </Fragment>
          )}
          {phase === "two" && (
            <Fragment>
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Text
                  size="15px"
                  color="$green800"
                  css={{
                    bgColor: "$green300",
                    br: "20px",
                    py: "5px",
                    px: "10px",
                    w: "fit-content",
                  }}
                >
                  Step 2 : Upload a showcase image.
                </Text>
              </motion.div>
              <motion.form
                initial={{ y: "50%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="profile_img_form"
              >
                <FileUpload onUpload={handleChange} />
                {error.value && <ErrorMessage text={error.msg} />}
                {img !== null && !error.value && (
                  <Image className="new_img_preview" src={img} />
                )}
              </motion.form>
            </Fragment>
          )}
          {phase === "three" && (
            <Fragment>
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Text
                  size="15px"
                  color="$cyan800"
                  css={{
                    bgColor: "$cyan300",
                    br: "20px",
                    py: "5px",
                    px: "10px",
                    w: "fit-content",
                  }}
                >
                  Step 3 : Tell us something about yourself.
                </Text>
              </motion.div>
              <motion.form
                initial={{ y: "50%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="profile_bio_form"
              >
                <Input
                  type="text"
                  bordered
                  placeholder="Work"
                  contentLeft={<TbBriefcase />}
                  aria-label="Work"
                  onChange={workHandler}
                  onBlur={workBlur}
                />
                {workError && (
                  <ErrorMessage text="Please enter your work here to continue." />
                )}
                <Textarea
                  type="text"
                  bordered
                  css={{ mt: "10px" }}
                  placeholder="Your bio should be under or equal to 100 characters."
                  contentLeft={<TbPencil />}
                  aria-label="Bio"
                  onChange={bioHandler}
                  onBlur={bioBlur}
                />
                {error.value && <ErrorMessage text={error.msg} />}
              </motion.form>
            </Fragment>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer
        className="upload_modal_footer"
        css={{
          position: "absolute",
          bottom: 0,
          bgBlur: "#ffffff77",
          paddingBottom: "70px",
        }}
      >
        {phase === "one" && (
          <Button
            className="cmt_btn"
            flat
            color="error"
            rounded
            auto
            onClick={setProfileImage}
          >
            {!loading ? "Next Step" : <Loading type="spinner" />}
          </Button>
        )}

        {phase === "two" && (
          <Button
            className="cmt_btn"
            flat
            color="error"
            rounded
            auto
            onClick={setShowcaseImage}
          >
            {!loading ? "Next Step" : <Loading type="spinner" />}
          </Button>
        )}

        {phase === "three" && (
          <Button
            className="cmt_btn"
            flat
            color="error"
            rounded
            auto
            onClick={finishSetupHandler}
          >
            {!loading ? "Finish" : <Loading type="spinner" />}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default NewUser;
