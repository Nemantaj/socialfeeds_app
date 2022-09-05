import { Text } from "@nextui-org/react";
import { TbAsterisk } from "react-icons/tb";

import "./ErrorMessage.css";

function ErrorMessage(props) {
  return (
    <Text
      size="13px"
      color="$red600"
      css={{ bgColor: "$red200", mt: "5px", br: "$base", p: "5px" }}
    >
      <TbAsterisk className="icon_position" />
      &nbsp;
      {props.text}
    </Text>
  );
}

export default ErrorMessage;
