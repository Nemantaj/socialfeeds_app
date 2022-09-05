import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { TbBrackets, TbCircleDashed, TbVideo } from "react-icons/tb";

import "./AddModule.css";

function AddModule(props) {
  return (
    <motion.div
      className="nav_add"
      initial={{ opacity: 0, y: "50%" }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Button auto flat color="error" onClick={props.postHandler}>
        <TbBrackets className="add_icons" /> Post
      </Button>
      <Button auto flat color="success" onClick={props.storyHandler}>
        <TbCircleDashed className="add_icons" /> Status
      </Button>
      <Button auto flat color="secondary" onClick={props.videoHandler}>
        <TbVideo className="add_icons" /> Video
      </Button>
    </motion.div>
  );
}

export default AddModule;
