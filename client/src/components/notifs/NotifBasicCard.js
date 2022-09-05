import { useEffect, memo, useState } from "react";
import { useSelector } from "react-redux";
import { Text, Card, Avatar, Divider } from "@nextui-org/react";
import ReactTimeAgo from "react-time-ago";

import { motion } from "framer-motion";

import "./NotifCard.css";

function NotifBasicCard(props) {
  const userId = useSelector((state) => state.auth.userId);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const isSeenDoc = props.items.to.find((doc) => {
      return doc.userId.toString() === userId.toString();
    });
    if (isSeenDoc) {
      setSeen(isSeenDoc.seen);
    }
  }, [props.items]);

  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Card
        variant="flat"
        css={{ mw: "550px", w: "100vw", p: "10px", my: "5px", bgColor: "#fff" }}
      >
        <div className="noti_avatar">
          <Avatar
            src={`https://socialfeedsapp.herokuapp.com/${props.items.image}`}
            textColor="white"
            squared
            color="success"
            css={{ mr: "10px" }}
          ></Avatar>
          <div className="noti_avt_info">
            <span>
              <Text size="13px" b>
                {props.items.title}
              </Text>
              <Text size="12px">
                <ReactTimeAgo date={props.items.createdAt} locale="en-US" />
              </Text>
            </span>
            <span>{!seen && <div className="notif_icon"></div>}</span>
          </div>
        </div>
      </Card>
      <Divider />
    </motion.div>
  );
}

function compare(prevProps, nextProps) {
  if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
    return true;
  }
  return false;
}

export default memo(NotifBasicCard, compare);
