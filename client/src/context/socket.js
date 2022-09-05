import React from "react";
import { useSelector } from "react-redux";
import openSocket from "socket.io-client";

export const socket = openSocket("https://socialfeedsapp.herokuapp.com", {
  transports: ["websocket"],
});

export const SocketContext = React.createContext();
