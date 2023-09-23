import { io } from "socket.io-client";

const URL = "https://skyjo-backend.voltvector.org";

export const socket = io(URL);
