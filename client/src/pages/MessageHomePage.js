import { useState, useEffect, useContext } from "react";
import { Text, Button, Loading } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { appActions } from "../store/app-slice";
import { SocketContext } from "../context/socket";
import { motion } from "framer-motion";

import AvatarHolder from "../components/message/AvatarHolder";
import MsgMainAvatar from "../components/message/MainAvatar";
import "./MessageHomePage.css";
import { TbPlus, TbTrash } from "react-icons/tb";
import MsgModal from "../components/message/MsgModal";
import SearchModule from "../components/navbar/SearchModule";
import MsgResult from "../components/message/MsgResult";

function MessagesHomePage() {
  const dispatch = useDispatch();
  const [convosData, setConvosData] = useState([]);
  const [msgVisible, setMsgVisible] = useState(false);
  const [render, setRender] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [header, setHeader] = useState(null);
  const [convoId, setConvoId] = useState(null);
  const [isDelete, setIsDelete] = useState(false);

  const socket = useContext(SocketContext);

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const msgNav = useSelector((state) => state.app.msgNav);

  useEffect(() => {
    socket.on("convos", (data) => {
      if (data.action === "new-convos") {
        if (
          userId.toString() === data.userId.toString() ||
          userId.toString() === data.otherId.toString()
        ) {
          let newConvos = [data.payload, ...convosData];
          setConvosData(newConvos);
        }
      } else if (data.action === "delete-convos") {
        let newConvos = [...convosData];
        const filteredConvos = newConvos.filter((doc) => {
          return doc._id.toString() !== data.payload.toString();
        });
        setConvosData(filteredConvos);
      }
    });
  }, [convosData]);

  useEffect(() => {
    setLoading(true);
    fetch("https://socialfeedsapp.herokuapp.com/chat/get-convos/" + userId, {
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
        if (!data.convosData) {
          dispatch(
            authActions.setErrorData({
              title: "Error Occured",
              msg: "An error occured while trying to retrive user information.",
            })
          );
          return dispatch(authActions.setPopOpen());
        }
        setConvosData(data.convosData);
        setLoading(false);
        console.log(data.convosData);
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
  }, [userId]);

  useEffect(() => {
    dispatch(appActions.setMessageNav(0));
  });

  function createConvos(fromId) {
    fetch(
      "https://socialfeedsapp.herokuapp.com/chat/create-convos/" +
        userId +
        "?fromId=" +
        fromId,
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
        if (!data.created) {
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

  function deleteConvos(convoId) {
    fetch(
      "https://socialfeedsapp.herokuapp.com/chat/delete-convos/" +
        convoId +
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
        dispatch(authActions.setErrorData(data));
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

  function searchHandler(value) {
    fetch(
      "https://socialfeedsapp.herokuapp.com/user/search-friends/" + userId + "?name=" + value,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.userResult) {
          setSearchResult(data.userResult);
        } else {
          return;
        }
      })
      .catch((err) => console.log(err));
  }

  function openMsgHandler(headerData, convoId) {
    setHeader(headerData);
    setConvoId(convoId);
    setMsgVisible(true);
  }

  function closeMsgHandler() {
    setRender((prevRender) => {
      prevRender + 1;
    });
    setMsgVisible(false);
  }

  function showSearchHandler() {
    if (showSearch === true) {
      setSearchResult([]);
    }
    setShowSearch(!showSearch);
  }

  function submitTextHandler(convoId, text, toUserId) {
    fetch("https://socialfeedsapp.herokuapp.com/chat/send-text/" + userId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        toUserId,
        convoId,
        text,
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
        if (!data.isSend) {
          dispatch(
            authActions.setErrorData({
              title: "Error Occured",
              msg: "An error occured while trying to retrive user information.",
            })
          );
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
    <motion.div
      initial={{ y: "25%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
      }}
      className="msg_home_styles"
    >
      <div className="msg_home_head">
        <Text h2>Messages</Text>
      </div>
      <div className="msg_home_bar">
        <Button
          flat
          auto
          color="secondary"
          rounded
          size="sm"
          css={{ ml: "3px" }}
          onClick={showSearchHandler}
          shadow={showSearch ? "true" : "false"}
        >
          <TbPlus />
        </Button>
        <Button
          flat
          rounded
          auto
          color="error"
          size="sm"
          css={{ ml: "3px" }}
          onClick={setDelete}
          shadow={isDelete ? "true" : "false"}
        >
          <TbTrash />
        </Button>
      </div>
      {showSearch && (
        <SearchModule classProp="msg_search" searchHandler={searchHandler} />
      )}
      {searchResult.map((doc) => {
        return (
          <MsgResult key={doc._id} items={doc} createHandler={createConvos} />
        );
      })}

      {loading && <Loading type="spinner" />}
      {!loading && (
        <div className="msg_holder">
          <AvatarHolder>
            {convosData.map((doc) => {
              return (
                <MsgMainAvatar
                  key={doc._id}
                  items={doc}
                  openHandler={openMsgHandler}
                  isDelete={isDelete}
                  deleteConvos={deleteConvos}
                />
              );
            })}
          </AvatarHolder>
        </div>
      )}
      {header && (
        <MsgModal
          visible={msgVisible}
          header={header}
          convoId={convoId}
          onClose={closeMsgHandler}
          textHandler={submitTextHandler}
        />
      )}
    </motion.div>
  );
}

export default MessagesHomePage;
