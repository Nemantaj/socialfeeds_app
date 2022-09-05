import { Popover, Text, Divider } from "@nextui-org/react";
import { TbAlertTriangle } from "react-icons/tb";

import "./ErrorPopUp.css";

function ErrorPopUp(props) {
  return (
    <Popover className="popup_error" placement="bottom" isBordered isOpen={props.popOpen} onOpenChange={props.setPopOpen}>
      <Popover.Content css={{ p: "10px", bgBlur: "#ffffff64" }}>
        <Text className="error_alert_head" color="error">
          <TbAlertTriangle className="error_alert_icon" />
          &nbsp;{props.error.title}
        </Text>
        {/* <Divider /> */}
        <Text className="error_content">{props.error.msg}</Text>
      </Popover.Content>
    </Popover>
  );
}

export default ErrorPopUp;
