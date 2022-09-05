import { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import {
  TbPlus,
  TbArrowBack,
  TbLocation,
  TbClipboardText,
  TbCheck,
} from "react-icons/tb";
import { Modal, Button, Input, Text, Image, Loading } from "@nextui-org/react";
import useInput from "../../hooks/useInput";
import ErrorMessage from "../auth/ErrorMessage";

import "./UploadModal.css";
import FileUpload from "../UI/FileUpload";

function UploadModal(props) {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnText, setBtnText] = useState("Post");
  const [image, setImage] = useState(null);
  const [error, setError] = useState({
    value: false,
    msg: "",
  });

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const {
    inputValue: locationValue,
    error: locationError,
    isValid: locationValid,
    inputHandler: locationHandler,
    blurHandler: locationBlur,
  } = useInput((value) => value !== "");

  const {
    inputValue: capValue,
    error: capError,
    isValid: capValid,
    inputHandler: capHandler,
    blurHandler: capBlur,
  } = useInput((value) => value !== "");

  const [img, setImg] = useState(null);

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
      setPostData(null);
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

  function submitHandler() {
    if (props.type === "post") {
      if (locationValue === "" || capValue === "" || image === null) {
        return setError({
          value: true,
          msg: "Please enter all the required fields.",
        });
      }
      setError({
        value: false,
        msg: "",
      });
      setPostData({
        location: locationValue,
        caption: capValue,
        img: image,
      });

      if (postData === null) {
        return;
      }

      console.log(postData);

      setLoading(true);

      const formData = new FormData();
      formData.append("caption", postData.caption);
      formData.append("location", postData.location);
      formData.append("img", postData.img);

      fetch("https://socialfeedsapp.herokuapp.com/post/new-post/" + userId, {
        method: "POST",
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
          if (!data.success) {
            return setError({
              value: true,
              msg: data.msg,
            });
          }
          setBtnText("Posted");
          setImg(null);
          setPostData(null);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }

    if (props.type === "story") {
      if (capValue === "" || image === null) {
        return setError({
          value: true,
          msg: "Please enter all the required fields.",
        });
      }
      setError({
        value: false,
        msg: "",
      });
      setPostData({
        caption: capValue,
        img: image,
      });

      if (postData === null) {
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("caption", postData.caption);
      formData.append("img", postData.img);

      fetch("https://socialfeedsapp.herokuapp.com/post/new-story/" + userId, {
        method: "POST",
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
          if (!data.story) {
            return setError({
              value: true,
              msg: data.msg,
            });
          }
          setBtnText("Posted");
          setImg(null);
          setImage(null);
          setPostData(null);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

      console.log(postData);
    }
  }

  function closeModal() {
    setImage(null);
    setPostData(null);
    setImg(null);
    props.onClose();
  }

  return (
    <Modal
      scroll
      fullScreen
      open={props.visible}
      onClose={closeModal}
      aria-labelledby="Upload Modal"
      className="cmt_modal"
      css={{ h: "100vh" }}
    >
      <Modal.Header className="msg_modal_head">
        <Text h3>
          {props.type === "post" && "New Post"}
          {props.type === "story" && "New Story"}
          {props.type === "video" && "New Video"}
        </Text>
        <Button auto flat rounded color="primary" size="sm">
          <TbArrowBack onClick={props.onClose} />
        </Button>
      </Modal.Header>
      <Modal.Body className="upload_modal_body_main">
        {props.type !== "video" && (
          <form className="upload_form">
            <FileUpload onUpload={handleChange} />
            {error.value && <ErrorMessage text={error.msg} />}
            {img !== null && !error.value && (
              <Image className="img_preview" src={img} />
            )}
            {props.type !== "story" && (
              <Fragment>
                <Input
                  contentLeftStyling={true}
                  color="error"
                  contentLeft={<TbLocation />}
                  bordered
                  type="text"
                  css={{ w: "100%", mt: "15px" }}
                  placeholder="Location"
                  onChange={locationHandler}
                  onBlur={locationBlur}
                  aria-label="Location"
                />
                {locationError && (
                  <ErrorMessage text="Please enter a location to post something!" />
                )}
              </Fragment>
            )}
            <Input
              contentLeftStyling={true}
              color="error"
              contentLeft={<TbClipboardText />}
              bordered
              type="text"
              css={{ w: "100%", mt: "15px" }}
              placeholder="Caption"
              onChange={capHandler}
              onBlur={capBlur}
              aria-label="Caption"
            />
            {capError && (
              <ErrorMessage text="Please enter a caption to post something!" />
            )}
          </form>
        )}
        {props.type === "video" && (
          <Text
            color="$red600"
            css={{
              mb: "10px",
              br: "20px",
              bgColor: "$red200",
              py: "5px",
              px: "10px",
            }}
          >
            This feature is currently not available due to storage issues!
          </Text>
        )}

        <div className="btnContainer">
          <Button
            className="cmt_btn"
            flat
            color={btnText === "Post" ? "error" : "success"}
            rounded
            auto
            onClick={submitHandler}
            disabled={props.type === "video" ? true : false}
          >
            {loading && <Loading type="spinner" />}
            {btnText === "Post" && !loading && (
              <Fragment>
                <TbPlus />
                &nbsp; Post
              </Fragment>
            )}
            {btnText === "Posted" && !loading && (
              <Fragment>
                <TbCheck />
                &nbsp; Posted
              </Fragment>
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default UploadModal;
