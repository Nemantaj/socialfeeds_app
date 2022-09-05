import { useEffect, useState, useContext, Fragment } from "react";
import { Button, Loading, Text, User } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { SocketContext } from "../context/socket";
import {
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import ReactTimeAgo from "react-time-ago";

import Zoomable from "react-instagram-zoom";
import CommentModal from "../components/comments/CommentModal";
import LikesModal from "../components/UI/LikesModal";
import OptionsPopup from "../components/UI/OptionsPopup";

import { TbMessageCircle } from "react-icons/tb";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "./SinglePostPage.css";

function SinglePostPage() {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNotif = searchParams.get("notif");
  const notifId = searchParams.get("notifId");

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const profileData = useSelector((state) => state.auth.profileData);

  const [loading, setLoading] = useState(false);
  const [cmtVisible, setCmtVisible] = useState(false);
  const [likeVisible, setLikeVisible] = useState(false);

  const [postData, setPostData] = useState({});
  const [liked, setLiked] = useState(false);
  const [userPost, setUserPost] = useState(false);

  const params = useParams();
  const postId = params.postId;
  console.log(postId);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("new-post", (data) => {
      if (data.action === "delete-post") {
        if (postId.toString() === data.postId.toString()) {
          console.log(data.postId);
          return navigate("/home");
        }
      }
    });

    socket.on("liked", (data) => {
      if (data.action === "post-liked") {
        if (postId.toString() === data.post._id.toString()) {
          setPostData(data.post);
        }
      } else if (data.action === "post-disliked") {
        if (postId.toString() === data.post._id.toString()) {
          setPostData(data.post);
        }
      }
    });

    return () => {
      socket.off("new-post");
      socket.off("liked");
    };
  }, [postData]);

  useEffect(() => {
    let postState = state?.postData || {};
    if (Object.keys(postState).length) {
      console.log(postState);
      setPostData(postState);
    } else {
      setLoading(true);
      fetch("https://socialfeedsapp.herokuapp.com/post/get-single-post/" + postId, {
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
          if (!data.postDoc) {
            dispatch(
              authActions.setErrorData({
                title: "Error Occured",
                msg: "An error occured while trying to retrive user information.",
              })
            );
            return dispatch(authActions.setPopOpen());
          }
          setPostData(data.postDoc);
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
  }, [postId]);

  useEffect(() => {
    if (isNotif) {
      fetch(
        "https://socialfeedsapp.herokuapp.com/notif/set-one-seen/" +
          notifId +
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
          if (!data.updated) {
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
  }, [notifId]);

  useEffect(() => {
    if (Object.keys(postData).length) {
      const isLiked = postData.likes.some((doc) => {
        return doc.likedBy.toString() === userId.toString();
      });
      const isUserPost = postData.userId._id.toString() === userId.toString();
      setUserPost(isUserPost);

      setLiked(isLiked);
    }
  }, [postData, postId]);

  function openCmtHandler() {
    setCmtVisible(true);
  }

  function closeCmtHandler() {
    setCmtVisible(false);
  }

  function openLikeHandler() {
    setLikeVisible(true);
  }

  function closeLikeHandler() {
    setLikeVisible(false);
  }

  function likeHandler() {
    fetch("https://socialfeedsapp.herokuapp.com/post/like-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: userId,
        postId: postId,
        fname: profileData.fname,
        lname: profileData.lname,
        img: profileData.img,
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
      });
  }

  function dislikeHandler() {
    fetch("https://socialfeedsapp.herokuapp.com/post/dislike-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: userId,
        postId: postId,
        img: postData.img,
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
      });
  }

  function deletePost() {
    fetch(
      "https://socialfeedsapp.herokuapp.com/post/delete-post/" + postId + "?userId=" + userId,
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
        if (!data.deleted) {
          dispatch(authActions.setErrorData(data));
          return dispatch(authActions.setPopOpen());
        }
        console.log(data);
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

  return (
    <div className="post_home_styles">
      {loading && <Loading type="spinner" />}
      {!loading && Object.keys(postData).length && (
        <Fragment>
          <motion.div
            initial={{ y: "25%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
            }}
            className="post_home_head"
          >
            <User
              name={postData.userId.fname + " " + postData.userId.lname}
              src={`https://socialfeedsapp.herokuapp.com/${postData.userId.img}`}
              description={postData.location}
              squared
              css={{ p: 0 }}
            />
            <Text
              size="12px"
              css={{ py: "5px", px: "10px", bgColor: "$pink300", br: "20px" }}
              color="$pink800"
            >
              <ReactTimeAgo date={postData.createdAt} locale="en-US" />
            </Text>
          </motion.div>
          <motion.div
            initial={{ y: "25%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
            }}
            className="single_holder"
          >
            <Zoomable>
              <img src={`https://socialfeedsapp.herokuapp.com/${postData.img}`} />
            </Zoomable>
          </motion.div>
          <motion.div
            initial={{ y: "25%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
            }}
            className="post_home_bar_caption"
          >
            <Text>{postData.caption}</Text>
          </motion.div>
          <motion.div
            initial={{ y: "25%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
            }}
            className="post_home_bar"
          >
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
              onClick={openLikeHandler}
            >
              <Text size="12px" color="$red600">
                {postData.likes.length} likes
              </Text>
            </Button>
            <Button
              rounded
              auto
              onClick={openCmtHandler}
              flat
              color="warning"
              css={{ mr: "5px" }}
              size="sm"
            >
              <TbMessageCircle />
              &nbsp;
              <Text size="12px" color="$yellow600">
                Comments
              </Text>
            </Button>
            <OptionsPopup
              delete={deletePost}
              postedId={postData.userId._id}
              userId={userId}
              doc={postData}
            />
          </motion.div>
        </Fragment>
      )}
      <LikesModal
        visible={likeVisible}
        postId={postId}
        onClose={closeLikeHandler}
      />
      <CommentModal
        visible={cmtVisible}
        postId={postId}
        img={null} //post img here!!
        onClose={closeCmtHandler}
      />
    </div>
  );
}

export default SinglePostPage;
