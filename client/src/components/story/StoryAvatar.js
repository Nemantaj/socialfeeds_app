import { useState, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Avatar } from "@nextui-org/react";

function StoryAvatar(props) {
  const [seen, setSeen] = useState(false);
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const isSeen = props.items.seenBy.some((doc) => {
      return doc.userId.toString() === userId.toString();
    });
    setSeen(isSeen);
    console.log(isSeen);
  }, [props.items]);

  function openHandler() {
    props.openHandler(props.items, seen);
  }

  return (
    <motion.div whileTap={{ scale: 0.9 }} onClick={openHandler}>
      <Avatar
        squared
        size="lg"
        src={`https://socialfeedsapp.herokuapp.com/${props.items.userId.img}`}
        className="story_avatar"
        bordered={seen ? "false" : "true"}
        color="error"
      />
    </motion.div>
  );
}

function compare(prevProps, nextProps) {
  if (JSON.stringify(prevProps) === JSON.stringify(nextProps)) {
    return true;
  }
  return false;
}

export default memo(StoryAvatar, compare);
