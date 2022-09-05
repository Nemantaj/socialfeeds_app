import { Text, Card, Avatar, Divider, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { TbCheck, TbTrash } from "react-icons/tb";
import ReactTimeAgo from "react-time-ago";

import "./NotifCard.css";

function NotifCard(props) {
  function cancelRequest() {
    props.delete(props.id);
  }

  function acceptRequest() {
    props.accept(props.id);
  }

  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Card
        variant="flat"
        css={{ mw: "550px", w: "100vw", p: "10px", my: "5px", bgColor: "#fff" }}
      >
        <div className="noti_avatar">
          <Avatar
            src={`https://socialfeedsapp.herokuapp.com/${props.img}`}
            textColor="white"
            squared
            color="success"
            css={{ mr: "10px" }}
          ></Avatar>
          <div className="noti_avt_info">
            <span>
              <Text size="13px" b>
                {props.fname + " " + props.lname} sent you a friend request.
              </Text>
              <Text size="12px">
                <ReactTimeAgo date={props.time} locale="en-US" />
              </Text>
            </span>
            <span>
              <div className="notif_icon"></div>
            </span>
          </div>
        </div>
        <div className="notif_actions">
          <Button
            auto
            size="sm"
            flat
            color="success"
            rounded
            css={{ mr: "5px" }}
            onClick={acceptRequest}
          >
            <TbCheck />
          </Button>
          <Button
            auto
            size="sm"
            flat
            color="error"
            rounded
            onClick={cancelRequest}
          >
            <TbTrash />
          </Button>
        </div>
      </Card>
      <Divider />
    </motion.div>
  );
}

export default NotifCard;
