import { useState, useEffect, Fragment, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { SocketContext } from "../../context/socket";
import { Modal, Button, Text, User, Loading } from "@nextui-org/react";
import Stories from "react-insta-stories";
import { motion } from "framer-motion";
import { TbArrowBack } from "react-icons/tb";

import "../comments/CommentModal.css";
import "./StoryModal.css";

function StoryModal(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [storyData, setStoryData] = useState([]);
  const [error, setError] = useState({
    value: false,
    msg: "",
  });

  const socket = useContext(SocketContext);

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    socket.on("story", (data) => {
      if (data.action === "new-story") {
        if (
          props.visible === true &&
          props.handler._id.toString() === data.story.storyHolder.toString()
        ) {
          let newStory = [...storyData, data.story];
          return setStoryData(newStory);
        }
      }
    });

    return () => {
      socket.off("story");
    };
  }, [storyData]);

  useEffect(() => {
    if (props.handler !== null) {
      setLoading(true);
      fetch("https://socialfeedsapp.herokuapp.com/post/get-stories/" + props.handler._id, {
        headers: {
          Authorization: "Bearer " + token,
        },
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
          if (!data.storyDoc) {
            dispatch(
              authActions.setErrorData({
                title: "Error Occured",
                msg: "An error occured while trying to retrive user information.",
              })
            );
            return dispatch(authActions.setPopOpen());
          }

          setStoryData(data.storyDoc);
          setLoading(false);
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
  }, [props.handler]);

  useEffect(() => {
    if (
      props.handler !== null &&
      props.seen === false &&
      props.visible === true
    ) {
      fetch(
        "https://socialfeedsapp.herokuapp.com/post/set-story-seen/" +
          props.handler._id +
          "?userId=" +
          userId,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
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
                title: "Error Occured",
                msg: "An error occured while trying to retrive user information.",
              })
            );
            return dispatch(authActions.setPopOpen());
          }
          props.setStory(data.newStoryHolder);
          console.log(data.newStoryHolder);
        })
        .catch((err) => {
          dispatch(
            authActions.setErrorData({
              title: "Error Occured",
              msg: "An error occured while trying to retrive user information.",
            })
          );
          dispatch(authActions.setPopOpen());
        });
    }
  }, [props.seen]);

  return (
    <Fragment>
      {props.handler !== null && (
        <Modal
          scroll
          fullScreen
          open={props.visible}
          onClose={props.onClose}
          aria-labelledby="Likes Modal"
          className="cmt_modal"
          css={{ h: "100vh" }}
        >
          <Modal.Header className="msg_modal_head">
            <User
              src={`https://socialfeedsapp.herokuapp.com/${props.handler.userId.img}`}
              name={`${props.handler.userId.fname} ${props.handler.userId.lname}`}
              css={{ p: 0 }}
              squared
            />
            <Button auto flat rounded color="primary" size="sm">
              <TbArrowBack onClick={props.onClose} />
            </Button>
          </Modal.Header>
          <Modal.Body className="story_modal_body">
            {loading && <Loading type="spinner" />}
            {!loading && storyData.length > 0 && (
              <Stories
                stories={storyData}
                width="100%"
                height="100%"
                loop="true"
              />
            )}
          </Modal.Body>
          
        </Modal>
      )}
    </Fragment>
  );
}

export default StoryModal;
