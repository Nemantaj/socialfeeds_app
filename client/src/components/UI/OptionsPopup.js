import { useNavigate, useLocation } from "react-router-dom";
import { Popover, Button } from "@nextui-org/react";
import { TbTrash, TbShare, TbFrame } from "react-icons/tb";
import { AiOutlineMore } from "react-icons/ai";

import "./OptionsPopup.css";

function OptionsPopup(props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Popover placement="top">
      <Popover.Trigger>
        <Button flat auto color="success" rounded size="sm">
          <AiOutlineMore />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="options_popup">
        <Button.Group
          vertical
          bordered
          color="grey"
          css={{ borderColor: "$green800" }}
          size="sm"
        >
          <Button
            type="button"
            icon={<TbShare />}
            onClick={() => {
              navigator.clipboard.writeText(
                `http://localhost:3000/home/${props.doc._id}`
              );
              console.log("copied!!!");
            }}
          >
            &nbsp;Copy Link
          </Button>
          {location.pathname !== `/home/${props.doc._id}` && (
            <Button
              type="button"
              icon={<TbFrame />}
              onClick={() => {
                navigate(`/home/${props.doc._id}`, {
                  state: { postData: props.doc },
                });
              }}
            >
              &nbsp;Expand
            </Button>
          )}
          {props.postedId.toString() === props.userId.toString() && (
            <Button
              onClick={props.delete}
              disabled={props.canDelete}
              icon={<TbTrash />}
            >
              &nbsp;Delete
            </Button>
          )}
        </Button.Group>
      </Popover.Content>
    </Popover>
  );
}

export default OptionsPopup;
