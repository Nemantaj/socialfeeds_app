import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Text, User, Loading } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TbArrowBack } from "react-icons/tb";

import "../comments/CommentModal.css";

function FriendsModal(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [friendsData, setFriendsData] = useState([]);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (props.userId) {
      setLoading(true);
      fetch("https://socialfeedsapp.herokuapp.com/user/get-friends-list/" + props.userId, {
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
          if (!data.friendsList) {
            dispatch(
              authActions.setErrorData({
                title: "Error Occured",
                msg: "An error occured while trying to retrive user information.",
              })
            );
            return dispatch(authActions.setPopOpen());
          }
          setFriendsData(data.friendsList);
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
  }, [props.userId]);

  return (
    <Modal
      scroll
      fullScreen
      open={props.visible}
      onClose={props.onClose}
      aria-labelledby="Likes Modal"
      className="cmt_modal"
      css={{ h: "100vh" }}
    >
      <Modal.Header className="msg_modal_head">
        <Text h3>Friends</Text>
        <Button auto flat rounded color="primary" size="sm">
          <TbArrowBack onClick={props.onClose} />
        </Button>
      </Modal.Header>
      <Modal.Body className="cmt_modal_body">
        {loading && <Loading type="spinner" />}
        {!loading &&
          friendsData.map((doc) => {
            return (
              <motion.div whileTap={{ scale: 0.9 }} key={doc._id}>
                <Link to={`/profile/${doc._id}`}>
                  <User
                    name={doc.fname + " " + doc.lname}
                    src={`https://socialfeedsapp.herokuapp.com/${doc.img}`}
                    squared
                    css={{ p: 0 }}
                    size="sm"
                  />
                </Link>
              </motion.div>
            );
          })}
      </Modal.Body>
    </Modal>
  );
}

export default FriendsModal;
