import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Text, User } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TbArrowBack } from "react-icons/tb";

import "../comments/CommentModal.css";

function LikesModal(props) {
  let postId = props.postId;
  const [loading, setLoading] = useState(false);
  const [likesData, setLikesData] = useState([]);
  const [error, setError] = useState({
    value: false,
    msg: "",
  });

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (postId) {
      setLoading("true");
      fetch("https://socialfeedsapp.herokuapp.com/post/get-likes/" + postId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (!data.likeDoc) {
            return setError({
              value: true,
              msg: data.msg,
            });
          }
          console.log(data.likeDoc);
          setLikesData(data.likeDoc.likes);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [postId]);

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
        <Text h3>Likes</Text>
        <Button auto flat rounded color="primary" size="sm">
          <TbArrowBack onClick={props.onClose} />
        </Button>
      </Modal.Header>
      <Modal.Body className="cmt_modal_body">
        {!loading &&
          likesData.map((doc) => {
            return (
              <motion.div whileTap={{ scale: 0.9 }} key={doc.likedBy._id}>
                <Link to={`/profile/${doc.likedBy._id}`}>
                  <User
                    name={doc.likedBy.fname + " " + doc.likedBy.lname}
                    src={`https://socialfeedsapp.herokuapp.com/${doc.likedBy.img}`}
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

export default LikesModal;
