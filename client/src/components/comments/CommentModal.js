import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../context/socket";
import { TbSend } from "react-icons/tb";
import { Modal, Button, Text, Input } from "@nextui-org/react";
import { TbArrowBack } from "react-icons/tb";

import useInput from "../../hooks/useInput";
import CommentChat from "./CommentChat";

import "./CommentModal.css";

function CommentModal(props) {
  let postId = props.postId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    value: false,
    msg: "",
  });
  const [cmtData, setCmtData] = useState([]);

  console.log(postId);

  const socket = useContext(SocketContext);

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const profileData = useSelector((state) => state.auth.profileData);

  const {
    inputValue: cmtValue,
    error: cmtError,
    isValid: cmtValid,
    inputHandler: cmtHandler,
    blurHandler: cmtBlur,
    clearInput: cmtClear,
  } = useInput((value) => value !== "");

  useEffect(() => {
    socket.on("comment", (data) => {
      if (data.action === "new-comment") {
        let newData = [...cmtData];
        if (!cmtData.length || Array.isArray(cmtData)) {
          if (postId == data.payload.postId) {
            let newCmtData = [...newData, data.payload];
            return setCmtData(newCmtData);
          }
        } else {
          const isPostCmt = newData.some((doc) => {
            return doc.postId.toString() === data.payload.postId.toString();
          });
          if (isPostCmt) {
            let newCmtData = [...newData, data.payload];
            setCmtData(newCmtData);
          }
        }
      } else if (data.action === "like-comment") {
        let newData = [...cmtData];
        const cmtIndex = newData.findIndex((doc) => {
          return doc._id.toString() == data.cmt._id.toString();
        });

        if (cmtIndex >= 0) {
          newData[cmtIndex] = data.cmt;
          setCmtData(newData);
        }
      } else if (data.action === "dislike-comment") {
        let newData = [...cmtData];
        const cmtIndex = newData.findIndex((doc) => {
          return doc._id.toString() === data.cmt._id.toString();
        });

        console.log(cmtIndex);

        if (cmtIndex >= 0) {
          newData[cmtIndex] = data.cmt;
          setCmtData(newData);
        }
      } else if (data.action === "delete-comment") {
        let newData = [...cmtData];
        const cmtIndex = newData.filter((doc) => {
          return doc._id.toString() !== data.cmtId.toString();
        });
        setCmtData(cmtIndex);
      }
    });
  }, [socket, cmtData, postId]);

  useEffect(() => {
    if (postId) {
      setLoading(true);
      fetch("https://socialfeedsapp.herokuapp.com/post/get-comment/" + postId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (!data.cmtData) {
            return setError({
              value: true,
              msg: data.msg,
            });
          }
          setCmtData(data.cmtData);
          console.log(data.cmtData);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [postId]);

  function likeComment(cmtId) {
    fetch("https://socialfeedsapp.herokuapp.com/post/like-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: userId,
        cmtId: cmtId,
        postId: postId,
        fname: profileData.fname,
        lname: profileData.lname,
        img: profileData.img,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data.liked) {
          return setError({
            value: true,
            msg: data.msg,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  function dislikeComment(cmtId) {
    fetch("https://socialfeedsapp.herokuapp.com/post/dislike-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: userId,
        cmtId: cmtId,
        postId: postId,
        fname: profileData.fname,
        lname: profileData.lname,
        img: props.img,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data.liked) {
          return setError({
            value: true,
            msg: data.msg,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  function deleteComment(cmtId) {
    fetch(
      "https://socialfeedsapp.herokuapp.com/post/delete-comment/" +
        cmtId +
        "?userId=" +
        userId +
        "&postId=" +
        postId,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data.deleted) {
          return setError({
            value: true,
            msg: data.msg,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function submitHandler() {
    if (cmtValue === "") {
      return;
    }

    setError({
      value: false,
      msg: "",
    });

    setLoading(true);

    fetch("https://socialfeedsapp.herokuapp.com/post/new-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        cmtText: cmtValue,
        userId: userId,
        postId: postId,
        fname: profileData.fname,
        lname: profileData.lname,
        img: profileData.img,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data.isSuccess) {
          return setError({
            value: true,
            msg: data.msg,
          });
        }
        setLoading(false);
        return cmtClear();
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
      aria-labelledby="Comment Modal"
      className="cmt_modal"
      css={{ h: "100vh" }}
    >
      <Modal.Header className="msg_modal_head">
        <Text h3>Comments</Text>
        <Button auto flat rounded color="primary" size="sm">
          <TbArrowBack onClick={props.onClose} />
        </Button>
      </Modal.Header>
      <Modal.Body className="cmt_modal_body">
        {cmtData.map((doc) => {
          return (
            <CommentChat
              items={doc}
              key={doc._id}
              likeHandler={likeComment}
              dislikeHandler={dislikeComment}
              deleteHandler={deleteComment}
            />
          );
        })}
        {!cmtData.length && (
          <Text b>There are no comments! Be the first one to comment.</Text>
        )}
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
          placeholder="Type your comment here!"
          aria-label="Comment here!"
          onChange={cmtHandler}
          onBlur={cmtBlur}
          value={cmtValue}
        ></Input>
        <Button
          className="cmt_btn"
          flat
          color="error"
          auto
          onClick={submitHandler}
        >
          <TbSend />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CommentModal;
