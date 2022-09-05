import { useState, useEffect, useContext, memo } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { SocketContext } from "../../context/socket";
import ReactTimeAgo from "react-time-ago";

import { Card, Avatar, Text, Divider, Button } from "@nextui-org/react";
import { TbStar, TbTrash } from "react-icons/tb";
import { motion } from "framer-motion";

import "./MainAvatar.css";

function MsgMainAvatar(props) {
  const dispatch = useDispatch();
  const [conDocs, setConDocs] = useState(null);
  const [render, setRender] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);

  const socket = useContext(SocketContext);

  const convoId = props.items._id;
  const [chatDoc, setChatDoc] = useState([]);

  useEffect(() => {
    socket.on("chat", (data) => {
      if (data.action === "new-chat") {
        if (convoId.toString() === data.payload.convos.toString()) {
          setRender(!render);
        }
      }
    });
  }, [socket, convoId]);

  function openModal() {
    props.openHandler(props.items, convoId);
  }

  useEffect(() => {
    fetch(
      "https://socialfeedsapp.herokuapp.com/chat/get-convos-details/" +
        props.items._id +
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
              msg: "Cannot retrive conversations!",
            })
          );
          return dispatch(authActions.setPopOpen());
        }
        return res.json();
      })
      .then((data) => {
        if (!data.isRes) {
          dispatch(authActions.setErrorData(data));
          return dispatch(authActions.setPopOpen());
        }
        setConDocs(data);
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
  }, [props.items, render]);

  function deleteHandler() {
    props.deleteConvos(convoId);
  }

  return (
    <motion.div whileTap={{ scale: 0.9 }} onClick={openModal}>
      <Card
        variant="flat"
        css={{
          mw: "550px",
          w: "100vw",
          p: "10px",
          my: "5px",
          bgColor: "#fff",
        }}
      >
        <div className="msg_avatar">
          <Avatar
            src={`https://socialfeedsapp.herokuapp.com/${props.items.header[0].userId.img}`}
            color="error"
            textColor="white"
            squared
            css={{ mr: "10px" }}
          ></Avatar>
          <div className="msg_avt_info">
            <div className="msg_time">
              <Text b size="14px">
                {`${props.items.header[0].userId.fname} ${props.items.header[0].userId.lname}`}
              </Text>
              {conDocs && conDocs.latest !== null && (
                <Text size="13px" className="text_limit">
                  {conDocs.latest.isFromUser
                    ? "You: " + conDocs.latest.conData.body
                    : conDocs.latest.conData.from.fname +
                      ": " +
                      conDocs.latest.conData.body}
                </Text>
              )}
            </div>
            {!props.isDelete && (
              <motion.div
                initial={{ y: "10%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                }}
                className="msg_time2"
              >
                {conDocs && conDocs.unread > 0 && (
                  <Text
                    size="12px"
                    css={{
                      py: "5px",
                      px: "10px",
                      bgColor: "$red300",
                      br: "20px",
                      mr: "5px",
                    }}
                    color="$red600"
                  >
                    <TbStar className="new_message_indication" />
                    {conDocs.unread}
                  </Text>
                )}
                {conDocs && conDocs.latest !== null && (
                  <Text
                    size="12px"
                    css={{
                      py: "5px",
                      px: "10px",
                      bgColor: "$pink300",
                      br: "20px",
                    }}
                    color="$pink800"
                  >
                    <ReactTimeAgo
                      date={conDocs.latest.conData.createdAt}
                      locale="en-US"
                    />
                  </Text>
                )}
              </motion.div>
            )}
            {props.isDelete && (
              <motion.div
                initial={{ y: "25%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                }}
                className="msg_time2"
              >
                <Button
                  auto
                  flat
                  size="sm"
                  color="error"
                  rounded
                  onClick={deleteHandler}
                >
                  <TbTrash />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
      <Divider />
    </motion.div>
  );
}

function compare(prevProps, nextProps) {
  if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
    return true;
  }
  return false;
}

export default memo(MsgMainAvatar, compare);
