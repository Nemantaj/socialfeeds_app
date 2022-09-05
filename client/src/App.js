import { useEffect, useContext, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { authActions } from "./store/auth-slice";
import { Container } from "react-grid-system";
import { appActions } from "./store/app-slice";
import { postActions } from "./store/posts-slice";
import { SocketContext } from "./context/socket";

import "./App.css";
import Header from "./components/navbar/Header";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MessagesHomePage from "./pages/MessageHomePage";
import SettingsPage from "./pages/SettingsPage";
import NotifPage from "./pages/NotificationPage";
// import MessagesWindowPage from "./pages/MessageWindow";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";
import SinglePostPage from "./pages/SinglePostPage";
import ErrorPopUp from "./components/UI/ErrorPopUp";
import NewUser from "./components/auth/NewUser";

function App() {
  const dispatch = useDispatch();

  const authStatus = useSelector((state) => state.auth.isAuth);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const expires = localStorage.getItem("expires");
  const profileData = useSelector((state) => state.auth.profileData);
  const errorData = useSelector((state) => state.auth.errorData);
  const popOpen = useSelector((state) => state.auth.popUp);
  const [profileFriends, setProfileFriends] = useState([]);

  const fetchedPost = useSelector((state) => state.post.storedPosts);
  const fetchedStory = useSelector((state) => state.post.storedStories);

  const [loading, setLoading] = useState([]);
  const renderHelper = useSelector((state) => state.app.reRenderHelper);
  const messageHelper = useSelector((state) => state.app.messageRender);
  const renderPosts = useSelector((state) => state.post.renderPosts);
  const renderStory = useSelector((state) => state.post.renderStory);
  const [skip, setSkip] = useState(fetchedPost.length);
  const [isMore, setIsMore] = useState(true);

  let storedNotif = useSelector((state) => state.app.storedNotifs);
  const socket = useContext(SocketContext);

  const [newVisible, setNewVisible] = useState(false);

  function setPopOpen() {
    dispatch(authActions.setPopClose());
  }

  function closeNewHandler() {
    setNewVisible(false);
  }

  // Auto Logout
  useEffect(() => {
    if (authStatus) {
      const expiresIn = new Date(expires).getTime() - new Date().getTime();
      setTimeout(() => {
        dispatch(authActions.setToken(null));
        dispatch(authActions.setUserId(null));
        dispatch(authActions.setAuth());
        dispatch(authActions.setProfileData(null));
        dispatch(postActions.setStoredPosts([]));
        dispatch(postActions.setStoredStories([]));
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("expires");
      }, expiresIn);
    }
  }, [authStatus]);

  useEffect(() => {
    setProfileFriends(profileData);
  }, [profileData]);

  //set skip
  useEffect(() => {
    setSkip(fetchedPost.length);
  }, [renderPosts, fetchedPost]);

  //socket.on handlers post
  useEffect(() => {
    socket.on("new-post", (data) => {
      if (data.action === "new-post") {
        console.log(profileData);
        let profileDummy = profileFriends;
        console.log(profileDummy);
        let friendsList = [
          ...profileDummy.friends,
          { userId: profileData._id },
        ];
        const isFriend = friendsList.some((doc) => {
          return doc.userId.toString() === data.post.userId._id.toString();
        });
        if (isFriend !== false) {
          const posts = [data.post, ...fetchedPost];
          dispatch(postActions.setStoredPosts(posts));
        }
      } else if (data.action === "delete-post") {
        const posts = [...fetchedPost];
        const postIndex = posts.filter((doc) => {
          return doc._id.toString() !== data.postId.toString();
        });
        dispatch(postActions.setStoredPosts(postIndex));
        console.log("deleted");
      }
    });

    socket.on("liked", (data) => {
      if (data.action === "post-liked") {
        let posts = [...fetchedPost];

        const postIndex = posts.findIndex((doc) => {
          return doc._id.toString() === data.post._id.toString();
        });
        if (postIndex >= 0) {
          posts[postIndex] = data.post;
          dispatch(postActions.setStoredPosts(posts));
        }
        console.log("liked");
      } else if (data.action === "post-disliked") {
        let posts = [...fetchedPost];
        const postIndex = posts.findIndex((doc) => {
          return doc._id.toString() === data.post._id.toString();
        });
        if (postIndex >= 0) {
          posts[postIndex] = data.post;
          dispatch(postActions.setStoredPosts(posts));
        }
        console.log("disliked");
      }
    });

    return () => {
      socket.off("new-post");
      socket.off("liked");
    };
  }, [fetchedPost, profileFriends]);

  // socket.on handlers story
  useEffect(() => {
    socket.on("story", (data) => {
      if (data.action === "new-story") {
        const profileDummy = [...profileFriends.friends];
        let friendsList = [...profileDummy, { userId: profileData._id }];
        const isFriend = friendsList.some((doc) => {
          return doc.userId.toString() === data.story.userId.toString();
        });
        if (isFriend) {
          dispatch(postActions.setRenderStory());
        }
      }
    });

    return () => {
      socket.off("story");
    };
  }, [profileFriends, fetchedStory]);

  // socket.on handlers notifications
  useEffect(() => {
    socket.on("client-connect", (data) => {
      console.log(data.id);
    });

    socket.on("notif", (data) => {
      if (data.action === "new-post") {
        const forUser = data.payload.to.some((doc) => {
          return doc.userId.toString() === userId.toString();
        });
        if (forUser === true) {
          const newNotifs = [data.payload, ...storedNotif];
          dispatch(appActions.renderCount());
          dispatch(appActions.setUnread());
          return dispatch(appActions.setStoredNotif(newNotifs));
        }
      } else if (data.action === "new-comment") {
        const forUser = data.payload.to.some((doc) => {
          return doc.userId.toString() === userId.toString();
        });
        if (forUser === true) {
          let cmtIndex = [...storedNotif];
          const newNotifs = cmtIndex.findIndex((doc) => {
            return doc._id.toString() === data.payload._id.toString();
          });
          if (newNotifs >= 0) {
            cmtIndex[newNotifs] = data.payload;
            dispatch(appActions.renderCount());
            dispatch(appActions.setUnread());
            return dispatch(appActions.setStoredNotif(cmtIndex));
          } else {
            const newNotif = [data.payload, ...storedNotif];
            dispatch(appActions.renderCount());
            dispatch(appActions.setUnread());
            return dispatch(appActions.setStoredNotif(newNotif));
          }
        }
      } else if (
        data.action === "liked-post" ||
        data.action === "liked-comment"
      ) {
        let forUser;
        if (data.action === "liked-post") {
          forUser = data.payload.to.some((doc) => {
            return doc.userId.toString() === userId.toString();
          });
        } else if (data.action === "liked-comment") {
          forUser = data.payload.to.some((doc) => {
            return doc.userId._id.toString() === userId.toString();
          });
        }

        if (forUser === true) {
          if (data.likeCounter === 1) {
            let newNotifs = [data.payload, ...storedNotif];
            dispatch(appActions.renderCount());
            dispatch(appActions.setUnread());
            return dispatch(appActions.setStoredNotif(newNotifs));
          } else if (data.likeCounter > 1) {
            let dummyNotifs = [...storedNotif];
            let newNotifs = dummyNotifs.findIndex((doc) => {
              return doc._id.toString() === data.payload._id.toString();
            });
            if (newNotifs >= 0) {
              dummyNotifs[newNotifs] = data.payload;
              dispatch(appActions.renderCount());
              dispatch(appActions.setUnread());
              return dispatch(appActions.setStoredNotif(dummyNotifs));
            }
          }
        }
      } else if (
        data.action === "dislike-post" ||
        data.action === "dislike-comment"
      ) {
        let forUser;
        if (data.action === "dislike-post") {
          forUser = data.payload.to.some((doc) => {
            return doc.userId.toString() === userId.toString();
          });
        } else if (data.action === "dislike-comment") {
          forUser = data.payload.to.some((doc) => {
            return doc.userId._id.toString() === userId.toString();
          });
        }

        if (forUser === true) {
          let newNotifs = [...storedNotif];
          const notifIndex = newNotifs.findIndex((doc) => {
            return doc._id.toString() === data.payload._id.toString();
          });
          if (notifIndex >= 0) {
            newNotifs[notifIndex] = data.payload;
            dispatch(appActions.renderCount());
            dispatch(appActions.setUnread());
            return dispatch(appActions.setStoredNotif(newNotifs));
          }
        }
      } else if (
        data.action === "disliked-post" ||
        data.action === "disliked-comment"
      ) {
        let newNotifs = [...storedNotif];
        const filterNotif = newNotifs.filter((doc) => {
          return doc._id.toString() !== data.payload.toString();
        });
        dispatch(appActions.renderCount());
        dispatch(appActions.setUnread());
        return dispatch(appActions.setStoredNotif(filterNotif));
      } else if (
        data.action === "delete-post" ||
        data.action === "delete-comment"
      ) {
        dispatch(appActions.renderCount());
        dispatch(appActions.setUnread());
        dispatch(appActions.renderHelper());
      }
    });

    socket.on("seen", (data) => {
      if (data.action === "seen-one") {
        let notifs = [...storedNotif];
        const notifIndex = notifs.findIndex((doc) => {
          return doc._id.toString() === data.notif._id.toString();
        });

        if (notifIndex >= 0) {
          notifs[notifIndex] = data.notif;
          dispatch(appActions.renderCount());
          dispatch(appActions.setUnread());
          return dispatch(appActions.setStoredNotif(notifs));
        }
      } else if (data.action === "set-seen-all") {
        if (userId.toString() === data.userId.toString()) {
          dispatch(appActions.renderCount());
          dispatch(appActions.setUnread());
          dispatch(appActions.renderHelper());
        }
      }
    });

    socket.on("chat", (data) => {
      if (data.action === "new-chat") {
        if (data.payload.to.toString() === userId.toString()) {
          dispatch(appActions.messageRender());
        }
      }
    });

    return () => {
      socket.off("chat");
      socket.off("seen");

      socket.off("seen");
      socket.off("client-connect");
    };
  }, [storedNotif]);

  // check if new user
  useEffect(() => {
    if (profileData && authStatus) {
      const isNewUser = profileData.newUser;
      console.log(isNewUser);
      if (isNewUser) {
        setNewVisible(true);
      }
    }
  }, [profileData]);

  // get unread notifications
  useEffect(() => {
    if (!token || !userId) {
      return;
    }

    if (authStatus) {
      fetch("https://socialfeedsapp.herokuapp.com/notif/get-unread/" + userId, {
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
          if (!data.isFetched) {
            dispatch(
              authActions.setErrorData({
                title: "Error Occured",
                msg: "An error occured while trying to retrive user information.",
              })
            );
            return dispatch(authActions.setPopOpen());
          }
          dispatch(appActions.setUnread(data.count));
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

    // const socket = openSocket("https://socialfeedsapp.herokuapp.com", {
    //   transports: ["websocket"],
    // });

    dispatch(authActions.setToken(token));
    dispatch(authActions.setUserId(userId));
    dispatch(authActions.setAuth());
  }, []);

  // get unread chats
  useEffect(() => {
    if (authStatus) {
      fetch("https://socialfeedsapp.herokuapp.com/chat/get-unread/" + userId, {
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
          if (!data.seenDoc) {
            dispatch(
              authActions.setErrorData({
                title: "Error Occured",
                msg: "An error occured while trying to retrive user information.",
              })
            );
            return dispatch(authActions.setPopOpen());
          }
          dispatch(appActions.setMessageNav(data.seenDoc));
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
  }, [messageHelper]);

  // get profile data
  useEffect(() => {
    if (authStatus) {
      fetch("https://socialfeedsapp.herokuapp.com/user/get-user/" + userId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          if (!data.userData) {
            dispatch(authActions.setErrorData(data));
            dispatch(authActions.setPopOpen());
          }
          dispatch(authActions.setProfileData(data.userData));
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
    if (authStatus) {
      fetch("https://socialfeedsapp.herokuapp.com/notif/get-notif/" + userId, {
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
          if (!data.isFetched) {
            dispatch(authActions.setErrorData(data));
            dispatch(authActions.setPopOpen());
          }
          dispatch(appActions.setStoredNotif(data.notifData));
        })
        .catch((err) => {
          dispatch(
            authActions.setErrorData({
              title: "Error Occured",
              msg: "An error occured while trying to retrive user information.",
            })
          );
        });
    }
  }, [renderHelper, authStatus]);

  // Fetch posts
  useEffect(() => {
    if (authStatus) {
      setLoading(true);
      console.log("fetching posts");
      fetch(
        "https://socialfeedsapp.herokuapp.com/post/get-posts/" + userId + "?skip=" + skip,
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
          if (!data.posts) {
            dispatch(
              authActions.setErrorData({
                title: "Error Occured",
                msg: "An error occured while trying to retrive user information.",
              })
            );
            return dispatch(authActions.setPopOpen());
          }

          let posts = [...fetchedPost, ...data.posts];
          dispatch(postActions.setStoredPosts(posts));
          setLoading(false);
          if (data.posts.length > 0) {
            setIsMore(true);
          } else {
            setIsMore(false);
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
  }, [renderPosts, authStatus]);

  // Fetch stories
  useEffect(() => {
    if (authStatus) {
      console.log("fetching stories");
      fetch("https://socialfeedsapp.herokuapp.com/post/get-story-holders/" + userId, {
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
          if (!data.storyHolders) {
            dispatch(
              authActions.setErrorData({
                title: "Error Occured",
                msg: "An error occured while trying to retrive user information.",
              })
            );
            return dispatch(authActions.setPopOpen());
          }
          console.log(data.storyHolders);
          dispatch(postActions.setStoredStories(data.storyHolders));
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
  }, [renderStory, authStatus]);

  return (
    <div className="App">
      <div className="error_div">
        <ErrorPopUp
          error={errorData}
          popOpen={popOpen}
          setPopOpen={setPopOpen}
        />
      </div>
      <Header>
        <Container>
          <Routes>
            <Route
              path="/"
              element={
                authStatus ? (
                  <HomePage
                    loading={loading}
                    fetchedPost={fetchedPost}
                    fetchedStory={fetchedStory}
                    isMore={isMore}
                  />
                ) : (
                  <Navigate to="/accounts" />
                )
              }
            />
            <Route
              path="/accounts"
              element={!authStatus ? <LoginPage /> : <Navigate to="/home" />}
            />
            <Route
              path="/home"
              element={
                authStatus ? (
                  <HomePage
                    loading={loading}
                    fetchedPost={fetchedPost}
                    fetchedStory={fetchedStory}
                  />
                ) : (
                  <Navigate to="/accounts" />
                )
              }
            />
            <Route
              path="/message"
              element={
                authStatus ? <MessagesHomePage /> : <Navigate to="/accounts" />
              }
            />
            {/* <Route path="/message/profile_name" element={<MessagesWindowPage />} /> */}
            <Route
              path="/profile"
              element={
                authStatus ? <ProfilePage /> : <Navigate to="/accounts" />
              }
            />
            <Route
              path="/profile/:profileId"
              element={authStatus ? <UsersPage /> : <Navigate to="/accounts" />}
            />
            <Route
              path="/notifs"
              element={authStatus ? <NotifPage /> : <Navigate to="/accounts" />}
            />
            <Route
              path="/home/:postId"
              element={
                authStatus ? <SinglePostPage /> : <Navigate to="/accounts" />
              }
            />
            <Route
              path="/settings/*"
              element={
                authStatus ? <SettingsPage /> : <Navigate to="/accounts" />
              }
            />
          </Routes>
          <NewUser visible={newVisible} onClose={closeNewHandler} />
        </Container>
      </Header>
    </div>
  );
}

export default App;
