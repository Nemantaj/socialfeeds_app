import { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import { motion } from "framer-motion";
import { TbSearch } from "react-icons/tb";

import "./SearchModule.css";

function SearchModule(props) {
  const [value, setValue] = useState("");

  function onChangeHandler(event) {
    setValue(event.target.value);
  }

  useEffect(() => {
    if (value === "") {
      return;
    }
    const timeoutId = setTimeout(() => {
      props.searchHandler(value);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value]);

  return (
    <motion.div
      className={props.classProp}
      initial={{ opacity: 0, y: "50%" }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Input
        type="text"
        placeholder="Search users by first name"
        css={{ w: "100%" }}
        shadow="false"
        contentLeft={<TbSearch />}
        onChange={onChangeHandler}
        aria-label="Search"
      />
    </motion.div>
  );
}

export default SearchModule;
