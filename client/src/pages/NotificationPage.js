import { useEffect, useState, useContext } from "react";
import { Button, Text } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { appActions } from "../store/app-slice";
import { postActions } from "../store/posts-slice";
import { SocketContext } from "../context/socket";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import NewMessageCounter from "../components/message/NewCounter";
import AvatarHolder from "../components/message/AvatarHolder";
import NotifCard from "../components/notifs/NotifCard";
import NotifBasicCard from "../components/notifs/NotifBasicCard";

import { TbPlus, TbChecks } from "react-icons/tb";
import "./NotificationPage.css";

function NotifPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const [request, setRequest] = useState([]);

  const profileData = useSelector((state) => state.auth.profileData);
  const countData = useSelector((state) => state.app.notifsCount);
  const storedNotif = useSelector((state) => state.app.storedNotifs);
  const renderCounter = useSelector((state) => state.app.renderCounter);

  const socket = useContext(SocketContext);

  useEffect(() => {
    dispatch(appActions.setUnreadZero());
  });

  useEffect(() => {
    socket.on("send-request", (data) => {
      if (data.action === "send-request-to") {
        fetch("https://socialfeedsapp.herokuapp.com/user/get-requests/" + userId, {
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
              dispatch(authActions.setPopOpen());
            }
            return res.json();
          })
          .then((data) => {
            if (!data.userData) {
              dispatch(authActions.setErrorData(data));
              dispatch(authActions.setPopOpen());
            }
            setRequest(data.userData.requests);
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
    });

    socket.on("delete-request", (data) => {
      if (data.action === "delete-req-to") {
        const newRequest = request.filter((doc) => {
          doc.from._id.toString() !== data.id.toString();
        });
        console.log(newRequest);
        setRequest(newRequest);
      }
    });
  }, [socket]);

  useEffect(() => {
    setLoading(true);
    fetch("https://socialfeedsapp.herokuapp.com/user/get-requests/" + userId, {
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
        if (!data.userData) {
          dispatch(authActions.setErrorData(data));
          dispatch(authActions.setPopOpen());
        }
        setRequest(data.userData.requests);
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
          dispatch(authActions.setErrorData(data));
          dispatch(authActions.setPopOpen());
        }
        dispatch(appActions.setCount(data.count));
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
  }, [renderCounter]);

  function markAllRead() {
    fetch("https://socialfeedsapp.herokuapp.com/notif/set-seen/" + userId, {
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

  function acceptRequest(profileId) {
    fetch(
      "https://socialfeedsapp.herokuapp.com/user/accept-request/" +
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
        dispatch(authActions.setErrorData(data.message));
        dispatch(authActions.setPopOpen());
        dispatch(authActions.setProfileData(data.userData));
        dispatch(postActions.setRender());
        return fetch("https://socialfeedsapp.herokuapp.com/user/get-requests/" + userId, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.userData) {
          dispatch(authActions.setErrorData(data));
          dispatch(authActions.setPopOpen());
        }
        setRequest(data.userData.requests);
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
      });
  }

  function cancelRequest(profileId) {
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

        return fetch("https://socialfeedsapp.herokuapp.com/user/get-requests/" + userId, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
      })
      .then((res) => {
        if (!res.ok) {
          return dispatch(
            authActions.setErrorData({
              title: "Error Occured",
              msg: "An error occured while trying to retrive user information.",
            })
          );
          dispatch(authActions.setPopOpen());
        }
        return res.json();
      })
      .then((data) => {
        if (!data.userData) {
          dispatch(authActions.setErrorData(data));
          dispatch(authActions.setPopOpen());
        }
        setRequest(data.userData.requests);
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
      });
  }

  return (
    <motion.div
      initial={{ y: "25%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", duration: 0.7 }}
      className="notif_home_styles"
    >
      <div className="notif_home_head">
        <Text h2>Notifications</Text>
      </div>
      <div className="notif_home_bar">
        <NewMessageCounter
          text={
            countData > 0
              ? countData + " unread notifications."
              : "no new notifications."
          }
        />
        {countData > 0 && (
          <Button
            size="sm"
            css={{ ml: "5px" }}
            flat
            color="error"
            onClick={markAllRead}
            rounded
            auto
          >
            <TbChecks />
          </Button>
        )}
      </div>
      <div className="notif_holder">
        <AvatarHolder>
          {Array.isArray(request) &&
            request.length > 0 &&
            request.map((doc) => {
              return (
                <NotifCard
                  fname={doc.from.fname}
                  lname={doc.from.lname}
                  img={doc.from.img}
                  time={doc.time}
                  delete={cancelRequest}
                  accept={acceptRequest}
                  id={doc.from._id}
                  key={doc._id}
                />
              );
            })}
          {Array.isArray(storedNotif) &&
            storedNotif.length > 0 &&
            storedNotif.map((doc) => {
              if (doc.notifType === "cmt-like") {
                return (
                  <Link
                    key={doc._id}
                    to={`/home/${doc.postId}?notif=true&notifId=${doc._id}`}
                  >
                    <NotifBasicCard key={doc._id} items={doc} />
                  </Link>
                );
              } else {
                return (
                  <Link
                    key={doc._id}
                    to={`/home/${doc.refTo}?notif=true&notifId=${doc._id}`}
                  >
                    <NotifBasicCard key={doc._id} items={doc} />
                  </Link>
                );
              }
            })}
        </AvatarHolder>
      </div>
      {/* <div className="notif_home_bar">
        <Button
          auto
          flat
          color="primary"
          rounded
          size="sm"
          css={{ my: "10px" }}
        >
          <TbPlus /> More
        </Button>
      </div> */}
    </motion.div>
  );
}

export default NotifPage;
