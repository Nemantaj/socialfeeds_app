import { memo, Fragment } from "react";
import { Text, Button } from "@nextui-org/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TbTrash } from "react-icons/tb";
import ReactTimeAgo from "react-time-ago";

import "./ChatBody.css";

let incoming = "";
let textColor = "";
let margin = "";

function ChatBody(props) {
  if (props.type === "incoming") {
    incoming = "$pink200";
    textColor = "$pink900";
    margin = "margin_incoming";
  } else {
    incoming = "$yellow200";
    textColor = "$yellow900";
    margin = "margin_outgoing";
  }

  function likeHandler() {
    if (props.type === "incoming") {
      return props.like(props.doc._id);
    }
    return;
  }

  function dislikeHandler() {
    if (props.type === "incoming") {
      return props.dislike(props.doc._id);
    }
    return;
  }

  function deleteMessageHandler() {
    props.delete(props.doc._id);
  }

  return (
    <div className={props.type}>
      <Text
        css={{
          bgColor: incoming,
          br: "20px",
          py: "5px",
          px: "10px",
          w: "max-content",
          mb: "$2",
          mw: "170px",
          direction: "ltr",
        }}
        color={textColor}
        size="15px"
      >
        {props.doc.body}
      </Text>
      <Text size="11px" className={margin} css={{ direction: "ltr" }}>
        {props.type === "incoming" && (
          <Fragment>
            <ReactTimeAgo date={props.doc.createdAt} locale="en-US" />
            {props.type === "incoming" && (
              <Fragment>
                {!props.doc.liked && (
                  <AiOutlineHeart
                    onClick={likeHandler}
                    className="msg_heart"
                    size="10px"
                  />
                )}
                {props.doc.liked && (
                  <AiFillHeart
                    onClick={dislikeHandler}
                    className="msg_heart"
                    size="10px"
                  />
                )}
              </Fragment>
            )}
          </Fragment>
        )}
        {props.type === "outgoing" && (
          <Fragment>
            {!props.isDelete && (
              <Fragment>
                {props.type === "outgoing" && props.doc.liked && (
                  <AiFillHeart className="msg_heart" size="10px" />
                )}
                <ReactTimeAgo date={props.doc.createdAt} locale="en-US" />
              </Fragment>
            )}
            {props.isDelete && (
              <Button
                auto
                rounded
                size="xs"
                color="error"
                light
                onClick={deleteMessageHandler}
              >
                <TbTrash />
              </Button>
            )}
          </Fragment>
        )}
      </Text>
      {props.type === "outgoing" && (
        <div
          className={
            props.doc.seen ? "read_indicator_green" : "read_indicator_red"
          }
        ></div>
      )}
    </div>
  );
}

function compare(prevProps, nextProps) {
  if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
    return true;
  }
  return false;
}

export default memo(ChatBody, compare);
