import { Fragment } from "react";
import MsgWindow from "../components/message/MsgWindow";
import AvatarHolder from "../components/message/AvatarHolder";

import "./MessageWindowPage.css";

function MessagesWindowPage() {
  return (
    <Fragment>
      <div className="msg_window_page">
        <AvatarHolder>
          <MsgWindow />
        </AvatarHolder>
      </div>
    </Fragment>
  );
}

export default MessagesWindowPage;
