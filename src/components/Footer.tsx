import { FC } from "react";
import { socket } from "../socket";

import Text from "../global/Text";
import Button from "../global/Button";
import { Player } from "../types/gameTypes";

type Footer = {
  isConnected: boolean;
  session: string;
  clientsInRoom: number;
  currentPlayerData: Player | undefined;
  showNextGameButton: boolean;
};

export const Footer: FC<Footer> = ({
  isConnected,
  session,
  clientsInRoom,
  currentPlayerData,
  showNextGameButton,
}) => {
  function nextGame() {
    socket.emit("next-round", { sessionId: session });
  }

  return (
    <div>
      <Text>Player Name: {currentPlayerData?.name}</Text>
      <Text>Round Points: {currentPlayerData?.roundPoints}</Text>
      <Text>Total Points: {currentPlayerData?.totalPoints}</Text>
      <br />
      <Text>State: {"" + isConnected}</Text>
      <Text>SocketId: {socket.id}</Text>
      <Text>Session: {session}</Text>
      <Text>Players: {clientsInRoom}</Text>
      {showNextGameButton && <Button onClick={nextGame}>Next Game</Button>}
    </div>
  );
};
