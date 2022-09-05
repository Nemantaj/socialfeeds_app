import { motion } from "framer-motion";
import { User } from "@nextui-org/react";
import { Link } from "react-router-dom";

function SearchResult(props) {
  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Link to={`/profile/${props.id}`}>
        <User
          src={`https://socialfeedsapp.herokuapp.com/${props.img}`}
          size="sm"
          squared
          name={props.fname + " " + props.lname}
          css={{ p: "10px" }}
        />
      </Link>
    </motion.div>
  );
}

export default SearchResult;
