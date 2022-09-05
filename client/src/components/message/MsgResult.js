import { User, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { TbPlus } from "react-icons/tb";

function MsgResult(props) {
  function createHandler() {
    props.createHandler(props.items._id);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="msg_search_result"
    >
      <User
        css={{ p: 0 }}
        src={`https://socialfeedsapp.herokuapp.com/${props.items.img}`}
        name={`${props.items.fname} ${props.items.lname}`}
        squared
      />
      <Button
        auto
        rounded
        size="sm"
        flat
        color="success"
        onClick={createHandler}
      >
        <TbPlus>&nbsp;Create</TbPlus>
      </Button>
    </motion.div>
  );
}

export default MsgResult;
