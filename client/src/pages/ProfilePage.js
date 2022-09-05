import { useEffect, useState, useContext } from "react";
import { Button, Card, User, Text, Loading } from "@nextui-org/react";
import { TbPlus } from "react-icons/tb";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { SocketContext } from "../context/socket";

import ProfilePill from "./ProfileCounter";
import FriendsModal from "../components/UI/FriendsModal";

import "./ProfilePage.css";

function ProfilePage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [render, setRender] = useState(0);
  const [renderOne, setRenderOne] = useState(0);
  const [profilePosts, setProfilePosts] = useState([]);
  const [listVisible, setListVisible] = useState(false);

  const socket = useContext(SocketContext);

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const profileData = useSelector((state) => state.auth.profileData);

  // handle socket.on
  useEffect(() => {
    socket.on("new-post", (data) => {
      if (data.action === "new-post") {
        const isUserPost =
          userId.toString() === data.post.userId._id.toString();

        if (isUserPost !== false) {
          const posts = [data.post, ...profilePosts];
          setProfilePosts(posts);
          setRenderOne((prev) => {
            prev + 1;
          });
        }
      } else if (data.action === "delete-post") {
        setRender((prevRender) => {
          prevRender + 1;
        });
        setRenderOne((prev) => {
          prev + 1;
        });
      }
    });
  }, [render]);

  // get-profile-data
  useEffect(() => {
    if (profileData === null) {
      setLoading(true);
      fetch("https://socialfeedsapp.herokuapp.com/user/get-user/" + userId, {
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
          dispatch(authActions.setProfileData(data.userData));
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
  }, [renderOne]);

  // get-user-posts
  useEffect(() => {
    setLoadingPosts(true);
    fetch("https://socialfeedsapp.herokuapp.com/post/get-user-posts/" + userId, {
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
  }, [render]);

  function setFriendList() {
    setListVisible(true);
  }

  function closeFriendList() {
    setListVisible(false);
  }

  return (
    <div className="profile_styles">
      {loading && <Loading type="spinner" />}
      {!loading && profileData !== null && (
        <motion.div
          initial={{ opacity: 0, y: "25%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
          }}
          className="profile_card"
        >
          <Card variant="shadow" css={{ maxHeight: "350px" }}>
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
                transition={{
                  type: "spring",
                }}
                className="profile_avatar"
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
                  <Button auto flat rounded size="sm" color="primary">
                    <TbPlus />
                    Follow
                  </Button>
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
            <div className="profile_gallery">
              {loadingPosts && <Loading type="spinner" />}
              {!loadingPosts &&
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
                        transition={{
                          type: "spring",
                        }}
                        src={`https://socialfeedsapp.herokuapp.com/${doc.img}`}
                      />
                    </Link>
                  );
                })}
            </div>
          </div>
        </motion.div>
      )}
      <FriendsModal
        visible={listVisible}
        userId={userId}
        onClose={closeFriendList}
      />
    </div>
  );
}

export default ProfilePage;
