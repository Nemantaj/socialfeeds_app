import { Card, Text, Avatar, Button, Input } from "@nextui-org/react";
import { motion } from "framer-motion";

import ChatBody from "./ChatBody";
import { TbSend } from "react-icons/tb";
import "./MsgWindow.css";

function MsgWindow() {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0, y: "50%" }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
    >
      <Card css={{ mt: "30px", mb: "50px", h: "80vh" }}>
        <Card.Header>
          <div className="msg_win_head">
            <Avatar text="Cool" color="success" css={{ mr: "10px" }} />
            <div className="msg_win_head_sub">
              <Text size="13px">Cool Dude 69</Text>
              <Text size="12px">Online</Text>
            </div>
          </div>
          <Button flat auto>
            :
          </Button>
        </Card.Header>
        <Card.Divider />
        <Card.Body>
          <ChatBody text="hello" type="incoming" />
          <ChatBody text="hello" type="outgoing" />
          <ChatBody text="hello from hello helo hilo hilao" type="incoming" />
          <ChatBody text="hello from hello helo hilo hilao" type="incoming" />
        </Card.Body>
        <Card.Divider />
        <Card.Footer>
          <div className="msg_window_footer">
            <Input
              type="text"
              css={{ w: "80%" }}
              bordered
              placeholder="Type your message here..."
            />
            <Button flat auto color="error">
              <TbSend />
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </motion.div>
  );
}

export default MsgWindow;
