import { Text } from "@nextui-org/react";

function NewMessageCounter(props) {
  return (
    <Text
      size="13px"
      css={{
        bgColor: "$green300",
        br: "20px",
        py: "5px",
        px: "10px",
        w: "max-content",
      }}
      color="$green800"
    >
      {props.text}
    </Text>
  );
}

export default NewMessageCounter;
