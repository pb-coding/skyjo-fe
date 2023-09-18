import { FC } from "react";
import { socket } from "../socket";

type ConnectionStateProps = {
  isConnected: boolean;
  session: string;
  clientsInRoom: number;
};

export const ConnectionState: FC<ConnectionStateProps> = ({
  isConnected,
  session,
  clientsInRoom,
}) => {
  return (
    <div>
      <p>
        State: {"" + isConnected} <br />
        Session: {session} <br />
        Players: {clientsInRoom} <br />
        SocketId: {socket.id}
      </p>
    </div>
  );
};
