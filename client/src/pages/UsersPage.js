import { Fragment, useEffect, useState, useContext } from "react";
import { Button, Card, User, Text, Loading } from "@nextui-org/react";
import { TbPlus } from "react-icons/tb";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { useParams, Link } from "react-router-dom";
import { SocketContext } from "../context/socket";

import ProfilePill from "./ProfileCounter";
import FriendsModal from "../components/UI/FriendsModal";

import "./ProfilePage.css";

function ProfilePage() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profilePosts, setProfilePosts] = useState([]);
  const [render, setRender] = useState(0);
  const [reqStatus, setReqStatus] = useState("nothing");
  const [listVisible, setListVisible] = useState(false);

  const socket = useContext(SocketContext);

  const params = useParams();

  const profileId = params.profileId;

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const userProfileData = useSelector((state) => state.auth.profileData);
  let status;

  useEffect(() => {
    socket.on("send-request", (data) => {
      if (data.action === "send-request-to") {
        setProfileData(data.data);
      } else if (data.action === "send-request-from") {
        dispatch(authActions.setProfileData(data.data));
      }
    });

    socket.on("delete-request", (data) => {
      if (data.action === "delete-req-from") {
        setReqStatus(data.status);
      }
    });

    socket.on("accept-request", (data) => {
      if (data.action === "accept-request") {
        setReqStatus(data.status);
      }
    });

    socket.on("unfriend", (data) => {
      if (data.action === "unfriend") {
        setReqStatus(data.status);
        setProfileData(data.userData);
      }
    });

    socket.on("new-post", (data) => {
      if (data.action === "delete-post") {
        setRender((prevRender) => {
          prevRender + 1;
        });
      }
    });
  }, [socket]);

  useEffect(() => {
    setLoading(true);
    fetch("https://socialfeedsapp.herokuapp.com/user/get-user/" + profileId, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.userData) {
          dispatch(authActions.setErrorData(data));
          dispatch(authActions.setPopOpen());
        }
        setProfileData(data.userData);
        return fetch(
          "https://socialfeedsapp.herokuapp.com/user/get-friend-status/" +
            userId +
            "?friend=" +
            profileId,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
      })
      .then((stat) => {
        return stat.json();
      })
      .then((stat) => {
        setReqStatus(stat.result);
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
  }, [profileId, render]);

  useEffect(() => {
    setLoadingPosts(true);
    fetch("https://socialfeedsapp.herokuapp.com/post/get-user-posts/" + profileId, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.userPosts) {
          dispatch(authActions.setErrorData(data));
          dispatch(authActions.setPopOpen());
        }
        console.log(data.userPosts);
        setProfilePosts(data.userPosts);
        setLoadingPosts(false);
      })
      .catch((err) => {
        dispatch(
          authActions.setErrorData({
            title: "Error Occured",
            msg: "An error occured while trying to retrive user information.",
          })
        );
        dispatch(authActions.setPopOpen());
        setLoadingPosts(false);
      });
  }, [profileId, render]);

  function sendRequest() {
    fetch("https://socialfeedsapp.herokuapp.com/user/send-request/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        toUser: profileId,
        fromUser: userId,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        dispatch(authActions.setErrorData(data.message));
        dispatch(authActions.setPopOpen());
        return fetch(
          "https://socialfeedsapp.herokuapp.com/user/get-friend-status/" +
            userId +
            "?friend=" +
            profileId,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
      })
      .then((stat) => {
        return stat.json();
      })
      .then((stat) => {
        setReqStatus(stat.result);
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

  function cancelRequest() {
    fetch(
      "https://socialfeedsapp.herokuapp.com/user/delete-request/" +
        userId +
        "?friend=" +
        profileId,
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
        dispatch(authActions.setErrorData(data));
        dispatch(authActions.setPopOpen());
        return fetch(
          "https://socialfeedsapp.herokuapp.com/user/get-friend-status/" +
            userId +
            "?friend=" +
            profileId,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
      })
      .then((stat) => {
        return stat.json();
      })
      .then((stat) => {
        setReqStatus(stat.result);
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

  function unfriendRequest() {
    fetch(
      "https://socialfeedsapp.herokuapp.com/user/unfriend-request/" +
        userId +
        "?friend=" +
        profileId,
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
        dispatch(authActions.setErrorData(data));
        dispatch(authActions.setPopOpen());
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

  function setFriendList() {
    setListVisible(true);
  }

  function closeFriendList() {
    setListVisible(false);
  }

  return (
    <div className="profile_styles">
      {loading && <Loading type="spinner" />}
      {!loading && profileData !== null && profileData !== undefined && (
        <div className="profile_card">
          <Card variant="shadow" css={{ height: "350px" }}>
            <Card.Body css={{ p: 0 }}>
              <Card.Image
                src={`https://socialfeedsapp.herokuapp.com/${profileData.imgShowcase}`}
                width="100%"
                height="100%"
                objectFit="cover"
                loading="lazy"
              />
            </Card.Body>
            <Card.Footer isBlurred className="profile_card_content">
              <motion.div
                initial={{ opacity: 0, y: "25%" }}
                animate={{ opacity: 1, y: 0 }}
                className="profile_avatar"
                transition={{
                  type: "spring",
                }}
              >
                <User
                  src={`https://socialfeedsapp.herokuapp.com/${profileData.img}`}
                  size="xl"
                  squared
                  name={profileData.fname + " " + profileData.lname}
                  description={profileData.email}
                  css={{ p: 0 }}
                />
                {profileData._id.toString() !== userId && (
                  <Fragment>
                    {reqStatus == "nothing" && (
                      <Button
                        auto
                        flat
                        rounded
                        size="sm"
                        color="primary"
                        onClick={sendRequest}
                      >
                        <TbPlus />
                        Follow
                      </Button>
                    )}
                    {reqStatus == "requested" && (
                      <Button
                        auto
                        flat
                        rounded
                        size="sm"
                        color="error"
                        onClick={cancelRequest}
                      >
                        <TbPlus />
                        Cancel
                      </Button>
                    )}
                    {reqStatus == "pending" && (
                      <Button
                        auto
                        flat
                        rounded
                        size="sm"
                        color="error"
                        onClick={cancelRequest}
                      >
                        <TbPlus />
                        Cancel
                      </Button>
                    )}
                    {reqStatus == "friend" && (
                      <Button
                        auto
                        flat
                        rounded
                        size="sm"
                        color="primary"
                        onClick={unfriendRequest}
                      >
                        <TbPlus />
                        Unfollow
                      </Button>
                    )}
                  </Fragment>
                )}
              </motion.div>
              {profileData.bio !== "" && (
                <motion.div
                  className="profile_bio"
                  initial={{ opacity: 0, y: "25%" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                  }}
                >
                  <Text>{profileData.bio}</Text>
                </motion.div>
              )}
              <motion.div
                className="profile_counter"
                initial={{ opacity: 0, y: "25%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                }}
              >
                <ProfilePill
                  bg="$yellow100"
                  clr="$yellow700"
                  desc="Followers"
                  count={`${profileData.friends.length} friends`}
                  openHandler={setFriendList}
                />
                <ProfilePill
                  bg="$purple100"
                  clr="$purple700"
                  desc="Posts"
                  count={`${profileData.posts} posts`}
                />
                <ProfilePill
                  bg="$red100"
                  clr="$red700"
                  desc="Work"
                  count={profileData.work}
                />
              </motion.div>
            </Card.Footer>
          </Card>
          <div className="profile_content_holder">
            {!profilePosts.length && reqStatus === "friend" && (
              <div className="no_post">
                <Text
                  color="$pink800"
                  css={{
                    bgColor: "$pink300",
                    br: "20px",
                    py: "5px",
                    px: "10px",
                    w: "fit-content",
                    mt: "50px",
                  }}
                  size="14px"
                >
                  There are no posts by{" "}
                  {profileData.fname + " " + profileData.lname}.
                </Text>
              </div>
            )}
            {reqStatus !== "friend" && (
              <div className="no_post">
                <Text
                  color="$pink800"
                  css={{
                    bgColor: "$pink300",
                    br: "20px",
                    py: "5px",
                    px: "10px",
                    w: "fit-content",
                    mt: "50px",
                  }}
                  size="14px"
                >
                  You must be friends with{" "}
                  {profileData.fname + " " + profileData.lname} to see their
                  posts.
                </Text>
              </div>
            )}
            <div className="profile_gallery">
              {loadingPosts && <Loading type="spinner" />}
              {!loadingPosts &&
                reqStatus === "friend" &&
                profilePosts.map((doc) => {
                  return (
                    <Link
                      to={`/home/${doc._id}`}
                      key={doc._id}
                      state={{ postData: doc }}
                    >
                      <motion.img
                        className="profile_card_images"
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring" }}
                        src={`https://socialfeedsapp.herokuapp.com/${doc.img}`}
                      />
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      <FriendsModal
        visible={listVisible}
        userId={profileId}
        onClose={closeFriendList}
      />
    </div>
  );
}

export default ProfilePage;
