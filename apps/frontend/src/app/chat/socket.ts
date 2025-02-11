import { io } from "socket.io-client";
import { BACKEND } from "../utils/constants";

export const socket = io(BACKEND ? BACKEND : "http://localhost:5000", {
  withCredentials: true,
});
