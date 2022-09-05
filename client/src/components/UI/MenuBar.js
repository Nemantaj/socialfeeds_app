import { TbFrame, TbTag, TbVideo } from "react-icons/tb";
import { motion } from "framer-motion";

import "./MenuBar.css";

function MenuBar() {
  return (
    <motion.div
      initial={{ y: "50%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="menu_bar_styles"
    >
      <motion.button
        className="menu_item"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <TbFrame />
      </motion.button>
      <motion.button
        className="menu_item"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <TbTag />
      </motion.button>
      <motion.button
        className="menu_item"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <TbVideo />
      </motion.button>
    </motion.div>
  );
}

export default MenuBar;
