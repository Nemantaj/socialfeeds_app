import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Text, Input } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TbArrowBack, TbClipboard } from "react-icons/tb";

import "../comments/CommentModal.css";

function EditModal(props) {
  let postId = props.postId;
  const [loading, setLoading] = useState(false);
  const [likesData, setLikesData] = useState([]);
  const [error, setError] = useState({
    value: false,
    msg: "",
  });

  const token = useSelector((state) => state.auth.token);

  return (
    <Modal
      fullScreen
      open={props.visible}
      onClose={props.onClose}
      aria-labelledby="Likes Modal"
      className="cmt_modal edit_modal"
      css={{ h: "100vh" }}
    >
      <Modal.Header className="msg_modal_head">
        <Text h3>Change Caption</Text>
        <Button auto flat rounded color="primary" size="sm">
          <TbArrowBack onClick={props.onClose} />
        </Button>
      </Modal.Header>
      <Modal.Body className="edit_modal_body">
        <Input type="text" placeholder="New caption" contentLeft={<TbClipboard />} />
      </Modal.Body>
    </Modal>
  );
}

export default EditModal;
