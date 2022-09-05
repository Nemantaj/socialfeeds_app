import { Avatar, Text, Button } from "@nextui-org/react";
import { TbFriends, TbBriefcase, TbFrame } from "react-icons/tb";

function ProfilePill(props) {
  return (
    <Text
      color={props.clr}
      css={{
        bgColor: props.bg,
        py: "5px",
        px: "10px",
        br: "20px",
        w: "90px",
        mr: "3px",
        textAlign: "start",
      }}
      size="13px"
    >
      {props.clr === "$yellow700" && (
        <Button
          type="button"
          auto
          rounded
          flat
          size="sm"
          color="warning"
		  css={{minWidth: 'fit-content !important'}}
          icon={<TbFriends />}
          onClick={props.openHandler}
        />
      )}
      {props.clr === "$purple700" && (
        <Button
          type="button"
          auto
          rounded
          flat
          size="sm"
          color="secondary"
          icon={<TbFrame />}
		  css={{minWidth: 'fit-content !important'}}
        />
      )}

      {props.clr === "$red700" && (
        <Button
          type="button"
          auto
          rounded
          flat
          size="sm"
          color="error"
          icon={<TbBriefcase />}
		  css={{minWidth: 'fit-content !important'}}
        />
      )}
      <Text b color={props.clr}>
        {props.count}
      </Text>
    </Text>
  );
}

export default ProfilePill;
