import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Avatar, Button, Text } from "@nextui-org/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import CommentPopUp from "./CommentPopUp";

import "./CommentChat.css";

function CommentChat(props) {
  const [liked, setLiked] = useState(false);
  const [userPost, setUserPost] = useState(false);

  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const isLiked = props.items.liked.some((doc) => {
      return doc.likedBy.toString() === userId.toString();
    });
    console.log(isLiked);
    const isUserComment =
      props.items.cmtBy._id.toString() === userId.toString();
    setUserPost(isUserComment);

    setLiked(isLiked);
  }, [props.items]);

  function likeComment() {
    props.likeHandler(props.items._id);
  }

  function dislikeComment() {
    props.dislikeHandler(props.items._id);
  }

  function deleteComment() {
    props.deleteHandler(props.items._id);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: "10%" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
      }}
      className="cmt_chat"
    >
      <Link to={`/profile/${props.items.cmtBy._id}`}>
        <Avatar
          src={`https://socialfeedsapp.herokuapp.com/${props.items.cmtBy.img}`}
          css={{ mr: "10px" }}
          squared
        />
      </Link>
      <div>
        <div className="cmt_user_info">
          <Text size="11px" css={{ py: "3px", px: "6px", br: "20px" }}>
            {`${props.items.cmtBy.fname} ${props.items.cmtBy.lname}`}
          </Text>
          <Text
            size="11px"
            color="$pink800"
            css={{
              bgColor: "$pink200",
              ml: "3px",
              py: "3px",
              px: "6px",
              br: "20px",
            }}
          >
            {new Date(props.items.createdAt).toLocaleDateString("en-US")}
          </Text>
          {userPost && <CommentPopUp deleteHandler={deleteComment} />}
          {!userPost && (
            <Fragment>
              {!liked && (
                <Button
                  auto
                  rounded
                  size="11px"
                  flat
                  color="error"
                  css={{ ml: "3px", py: "3px", px: "6px" }}
                  onClick={likeComment}
                >
                  <AiOutlineHeart />
                </Button>
              )}
              {liked && (
                <Button
                  auto
                  rounded
                  size="11px"
                  flat
                  color="error"
                  css={{ ml: "3px", py: "3px", px: "6px" }}
                  onClick={dislikeComment}
                >
                  <AiFillHeart />
                </Button>
              )}
            </Fragment>
          )}
          <Text size="11px" color="$red600" css={{ py: "3px", px: "3px" }}>
            {props.items.liked.length}&nbsp;likes
          </Text>
        </div>

        <Text size="13px" css={{ py: "3px", px: "6px" }}>
          {props.items.comment}
        </Text>
      </div>
    </motion.div>
  );
}

export default CommentChat;
