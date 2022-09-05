import { useState, memo, useEffect, Fragment } from "react";
import { Button, Card, User } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { Text } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ReactTimeAgo from "react-time-ago";

import { TbMessageCircle } from "react-icons/tb";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Zoomable from "react-instagram-zoom";
import OptionsPopup from "./OptionsPopup";

import "./Card.css";

function SfCard(props) {
  const [liked, setLiked] = useState(false);
  const [userPost, setUserPost] = useState(false);

  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const isLiked = props.items.likes.some((doc) => {
      return doc.likedBy.toString() === userId.toString();
    });
    const isUserPost = props.items.userId._id.toString() === userId.toString();
    setUserPost(isUserPost);

    console.log("Running");
    setLiked(isLiked);
  }, [props.items]);

  function likeHandler() {
    props.likeHandler(props.items._id);
  }

  function dislikeHandler() {
    props.dislikeHandler(props.items._id, props.items.img);
  }

  function deleteHandler() {
    props.deleteHandler(props.items._id);
  }

  function openHandlerMiddle() {
    props.openHandler(props.items._id, props.items.img);
  }

  function openHandlerLike() {
    props.openLikeHandler(props.items._id);
  }

  console.log("This card rerendered " + props.items._id);

  return (
    <Card css={{ mw: "550px", my: "10px" }} variant="bordered">
      <Card.Header>
        <div className="card_header">
          <Link to={`/profile/${props.items.userId._id}`}>
            <User
              src={`https://socialfeedsapp.herokuapp.com/${props.items.userId.img}`}
              name={props.items.userId.fname + " " + props.items.userId.lname}
              squared
              description={props.items.location}
              size="sm"
              css={{ p: 0 }}
            />
          </Link>
          <div className="card_header_sub2">
            <Text
              size="12px"
              css={{ py: "5px", px: "10px", bgColor: "$pink300", br: "20px" }}
              color="$pink800"
            >
              {/* {new Date(props.items.createdAt).toLocaleDateString("en-US")} */}
              <ReactTimeAgo date={props.items.createdAt} locale="en-US" />
            </Text>
          </div>
        </div>
      </Card.Header>
      <Zoomable>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            className="img"
            src={`https://socialfeedsapp.herokuapp.com/${props.items.img}`}
            objectFit="cover"
            loading="lazy"
          />
        </Card.Body>
      </Zoomable>
      <Card.Footer className="card_footer_con">
        <div className="card_footer">
          {!userPost ? (
            <Fragment>
              {!liked && (
                <Button
                  rounded
                  auto
                  size="sm"
                  css={{ mr: "5px" }}
                  flat
                  color="error"
                  onClick={likeHandler}
                >
                  <AiOutlineHeart />
                </Button>
              )}
              {liked && (
                <Button
                  rounded
                  auto
                  size="sm"
                  css={{ mr: "5px" }}
                  flat
                  color="error"
                  onClick={dislikeHandler}
                >
                  <AiFillHeart />
                </Button>
              )}
            </Fragment>
          ) : (
            ""
          )}
          <Button
            rounded
            auto
            size="sm"
            css={{ mr: "5px" }}
            flat
            color="error"
            onClick={openHandlerLike}
          >
            <Text size="12px" color="$red600">
              {props.items.likes.length} likes
            </Text>
          </Button>
          <Button
            rounded
            auto
            onClick={openHandlerMiddle}
            flat
            color="warning"
            css={{ mr: "5px" }}
            size="sm"
          >
            <TbMessageCircle />
          </Button>
          <OptionsPopup
            delete={deleteHandler}
            postedId={props.items.userId._id}
            userId={userId}
            doc={props.items}
          />
        </div>
        <Text
          size="13px"
          css={{
            mt: "10px",
            textAlign: "start",
          }}
        >
          {props.items.caption}
        </Text>
      </Card.Footer>
    </Card>
  );
}

function compare(prevProps, nextProps) {
  if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
    return true;
  }
  return false;
}

export default memo(SfCard, compare);
