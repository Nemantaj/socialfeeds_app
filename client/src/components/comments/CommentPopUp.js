import { Popover, Button } from "@nextui-org/react";
import { AiOutlineMore } from "react-icons/ai";
import { TbTrash } from "react-icons/tb";

import "./CommentPopUp.css";

function CommentPopUp(props) {
  return (
    <Popover placement="left">
      <Popover.Trigger>
        <Button
          auto
          rounded
          size="11px"
          flat
          color="error"
          css={{ ml: "3px", py: "3px", px: "6px" }}
        >
          <AiOutlineMore />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="comment_popup">
        <Button
          flat
          bordered
          size="sm"
          color="error"
          onClick={props.deleteHandler}
        >
          <TbTrash /> Delete
        </Button>
      </Popover.Content>
    </Popover>
  );
}

export default CommentPopUp;
