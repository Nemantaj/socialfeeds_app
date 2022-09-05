import { motion } from "framer-motion";

function NavItem(props) {
  return (
    <motion.div
      className="nav_pill"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {props.children}
    </motion.div>
  );
}

export default NavItem;
