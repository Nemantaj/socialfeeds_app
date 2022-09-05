import { Fragment, useState, useEffect, useRef } from "react";
import { Loading, Text } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { postActions } from "../store/posts-slice";

import CommentModal from "../components/comments/CommentModal";
import LikesModal from "../components/UI/LikesModal";
import StoryModal from "../components/story/StoryModal";
import SfCard from "../components/UI/Card";
import StoryAvatar from "../components/story/StoryAvatar";

import "./HomePage.css";

function HomePage(props) {
  const dispatch = useDispatch();
  const scrollRef = useRef();

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const profileData = useSelector((state) => state.auth.profileData);

  const [cmtVisible, setCmtVisible] = useState(false);
  const [likeVisible, setLikeVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [isScroll, setIsScroll] = useState(false);

  const [postId, setPostId] = useState(null);
  const [likeId, setLikeId] = useState(null);
  const [seen, setSeen] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [handler, setHandler] = useState(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setIsScroll(entry.isIntersecting);
    });

    observer.observe(scrollRef.current);
  }, []);

  // Check if scroll
  useEffect(() => {
    if (isScroll && props.fetchedPost.length > 0) {
      dispatch(postActions.setRender());
    }
  }, [isScroll]);

  function openCmtHandler(passPostId, passPostImg) {
    setPostId(passPostId);
    setPostImage(passPostImg);
    setCmtVisible(true);
  }

  function closeCmtHandler() {
    setCmtVisible(false);
  }

  function openLikeHandler(passPostId) {
    setLikeId(passPostId);
    setLikeVisible(true);
  }

  function openStoryHandler(handle, seen) {
    setSeen(seen);
    setHandler(handle);
    setStoryVisible(true);
  }

  function closeStoryHandler() {
    setStoryVisible(false);
  }

  function closeLikeHandler() {
    setLikeVisible(false);
  }

  function likeHandler(postId) {
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

  function dislikeHandler(postId, img) {
    fetch("https://socialfeedsapp.herokuapp.com/post/dislike-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userId: userId,
        postId: postId,
        img: img,
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

  function deletePost(postId) {
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

  function setPostSkip() {
    setSkip(fetchedPost.length);
  }

  function setStorySeen(handler) {
    let newStory = [...props.fetchedStory];
    const storyIndex = newStory.findIndex((doc) => {
      return doc._id.toString() === handler._id.toString();
    });

    if (storyIndex >= 0) {
      newStory[storyIndex] = handler;
      dispatch(postActions.setStoredStories(newStory));
    }
  }

  console.log("home running");
  console.log(isScroll);
  console.log(props.fetchedPost);

  return (
    <Fragment>
      <div className="homepage_styles" id="scroll_div">
        <div className="story_holders">
          {props.fetchedStory.length > 0 &&
            props.fetchedStory.map((doc) => {
              return (
                <StoryAvatar
                  key={doc._id}
                  items={doc}
                  openHandler={openStoryHandler}
                />
              );
            })}
        </div>
        {props.fetchedPost.length > 0 &&
          props.fetchedPost.map((item) => (
            <SfCard
              key={item._id}
              items={item}
              dislikeHandler={dislikeHandler}
              likeHandler={likeHandler}
              deleteHandler={deletePost}
              openHandler={openCmtHandler}
              openLikeHandler={openLikeHandler}
            />
          ))}
        {props.loading && <Loading type="spinner" />}
        {props.isMore === false && (
          <Text
            size="14px"
            color="$pink800"
            css={{
              bgColor: "$pink300",
              br: "20px",
              py: "5px",
              px: "10px",
              w: "fit-content",
              mt: "50px",
            }}
          >
            There are no more posts to load.
          </Text>
        )}
        <LikesModal
          visible={likeVisible}
          postId={likeId}
          onClose={closeLikeHandler}
        />
        <CommentModal
          visible={cmtVisible}
          postId={postId}
          img={postImage}
          onClose={closeCmtHandler}
        />
        <StoryModal
          visible={storyVisible}
          handler={handler}
          seen={seen}
          onClose={closeStoryHandler}
          setStory={setStorySeen}
        />
      </div>
      <div ref={scrollRef}>
        <Text
          h4
          css={{
            mt: "20px",
            mb: "5px",
            textGradient: "45deg, $red600 -20%, $pink600 100%",
          }}
        >
          Socialfeeds v2.0.0{" "}
        </Text>
      </div>
    </Fragment>
  );
}

export default HomePage;
