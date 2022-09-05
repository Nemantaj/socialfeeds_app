import { useState, useEffect, useContext, useRef } from "react";
import { TbSend, TbArrowBack, TbTrash } from "react-icons/tb";
import { Modal, Button, Input, User } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { SocketContext } from "../../context/socket";

import useInput from "../../hooks/useInput";
import ChatBody from "./ChatBody";

import "./MsgModal.css";

function MsgModal(props) {
  const dispatch = useDispatch();
  let header = props.header;
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState([]);
  const [render, setRender] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  const msgBody = useRef();

  const socket = useContext(SocketContext);

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const {
    inputValue: textValue,
    error: textError,
    isValid: textValid,
    inputHandler: textHandler,
    blurHandler: textBlur,
    clearInput: textClear,
  } = useInput((value) => value !== "");

  function submitText() {
    if (textValid) {
      props.textHandler(
        props.header._id,
        textValue,
        props.header.header[0].userId._id
      );
      return textClear();
    }
  }

  useEffect(() => {
    socket.on("chat", (data) => {
      if (data.action === "new-chat") {
        if (props.convoId.toString() === data.convoId.toString()) {
          let newChat = [...chats, data.payload];
          return setChats(newChat);
        }
      } else if (data.action === "delete") {
        let newChats = [...chats];
        const filteredChat = newChats.filter((doc) => {
          return doc._id.toString() !== data.payload.toString();
        });
        return setChats(filteredChat);
      } else if (data.action === "liked") {
        let newChats = [...chats];
        const chatIndex = newChats.findIndex((doc) => {
          return doc._id.toString() === data.payload._id.toString();
        });
        if (chatIndex >= 0) {
          newChats[chatIndex] = data.payload;
          return setChats(newChats);
        }
      } else if (data.action === "disliked") {
        let newChats = [...chats];
        const chatIndex = newChats.findIndex((doc) => {
          return doc._id.toString() === data.payload._id.toString();
        });
        if (chatIndex >= 0) {
          newChats[chatIndex] = data.payload;
          return setChats(newChats);
        }
      } else if (data.action === "seen-all") {
        if (
          props.convoId.toString() === data.payload.toString() &&
          data.seenBy.toString() !== userId.toString()
        ) {
          let newChat = [...chats];
          const updatedChat = newChat.map((doc, i) => {
            if (doc.to.toString() === data.seenBy.toString()) {
              return { ...doc, seen: true };
            } else {
              return doc;
            }
          });
          return setChats(updatedChat);
        }
      }
    });

    return () => {
      socket.off("chat");
    };
  }, [chats]);

  useEffect(() => {
    msgBody.current && msgBody.current.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    const unread = chats.filter((doc) => {
      return doc.seen !== true;
    });
    const unreadNumber = unread.length;
    if (unreadNumber > 0 && props.visible) {
      fetch(
        "https://socialfeedsapp.herokuapp.com/chat/set-seen/" +
          props.convoId +
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
          if (!data.isSeen) {
            dispatch(authActions.setErrorData(data));
            return dispatch(authActions.setPopOpen());
          }
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
  }, [chats, props.convoId]);

  useEffect(() => {
    setLoading(true);
    fetch("https://socialfeedsapp.herokuapp.com/chat/get-chats/" + props.convoId, {
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
        if (!data.chatDoc) {
          dispatch(authActions.setErrorData(data));
          return dispatch(authActions.setPopOpen());
        }
        setChats(data.chatDoc);
        console.log(data.chatDoc);
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
  }, [props.convoId, render]);

  function likeMessage(msgId) {
    fetch(
      "https://socialfeedsapp.herokuapp.com/chat/set-liked/" + msgId + "?userId=" + userId,
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
        if (!data.liked) {
          dispatch(authActions.setErrorData(data));
          return dispatch(authActions.setPopOpen());
        }
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

  function dislikeMessage(msgId) {
    fetch(
      "https://socialfeedsapp.herokuapp.com/chat/set-disliked/" + msgId + "?userId=" + userId,
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
        if (!data.liked) {
          dispatch(authActions.setErrorData(data));
          return dispatch(authActions.setPopOpen());
        }
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

  function deleteMessage(msgId) {
    fetch(
      "https://socialfeedsapp.herokuapp.com/chat/delete-text/" + msgId + "?userId=" + userId,
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
        if (!data.isDeleted) {
          dispatch(authActions.setErrorData(data));
          return dispatch(authActions.setPopOpen());
        }
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

  function setDelete() {
    setIsDelete(!isDelete);
  }

  return (
    <Modal
      scroll
      fullScreen
      open={props.visible}
      onClose={props.onClose}
      aria-labelledby="Comment Modal"
      className="cmt_modal"
      css={{ h: "100vh" }}
      aria-label="Message Modal"
    >
      <Modal.Header className="msg_modal_head">
        <User
          src={`https://socialfeedsapp.herokuapp.com/${props.header.header[0].userId.img}`}
          name={`${props.header.header[0].userId.fname} ${props.header.header[0].userId.lname}`}
          size="sm"
          squared
          description="online"
          css={{ p: 0 }}
        />
        <div className="msg_modal_actions">
          <Button
            auto
            flat
            rounded
            color="error"
            css={{ mr: "3px" }}
            size="sm"
            onClick={setDelete}
            shadow={isDelete ? "true" : "false"}
          >
            <TbTrash />
          </Button>
          <Button auto flat rounded color="primary" size="sm">
            <TbArrowBack onClick={props.onClose} />
          </Button>
        </div>
      </Modal.Header>
      <Modal.Body className="msg_modal_body_main">
        <div className="msg_modal_body">
          {chats.map((doc) => {
            const isUser = doc.from.toString() === userId.toString();
            if (isUser) {
              return (
                <ChatBody
                  key={doc._id}
                  doc={doc}
                  type="outgoing"
                  isDelete={isDelete}
                  delete={deleteMessage}
                />
              );
            }
            return (
              <ChatBody
                key={doc._id}
                doc={doc}
                type="incoming"
                like={likeMessage}
                dislike={dislikeMessage}
              />
            );
          })}
          <div ref={msgBody}></div>
        </div>
      </Modal.Body>
      <Modal.Footer
        className="cmt_modal_footer"
        css={{
          position: "absolute",
          bottom: 0,
          bgBlur: "#ffffff77",
          paddingBottom: "70px",
        }}
      >
        <Input
          className="cmt_input"
          bordered
          type="text"
          placeholder="Type your message here!"
          aria-label="Chat Input"
          onChange={textHandler}
          onBlur={textBlur}
          color={textError ? "error" : "default"}
          value={textValue}
        ></Input>
        <Button
          className="cmt_btn"
          flat
          color="error"
          auto
          onClick={submitText}
        >
          <TbSend />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MsgModal;
