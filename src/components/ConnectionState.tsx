import { FC } from "react";
import { socket } from "../socket";

import Text from "../global/Text";

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
      <Text>
        State: {"" + isConnected} <br />
        Session: {session} <br />
        Players: {clientsInRoom} <br />
        SocketId: {socket.id}
      </Text>
    </div>
  );
};
