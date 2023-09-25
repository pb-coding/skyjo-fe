import { Dispatch, FC, SetStateAction } from "react";
import { socket } from "../socket";

import Text from "../global/Text";
import Button from "../global/Button";
import { Player } from "../types/gameTypes";

type Footer = {
  isConnected: boolean;
  session: string;
  clientsInRoom: number;
  playerData: Player[];
  showNextGameButton: boolean;
  setClientsInRoom: Dispatch<SetStateAction<number>>;
  setSession: Dispatch<SetStateAction<string>>;
};

// TODO: use clients in room to validate player count

export const Footer: FC<Footer> = ({
  isConnected,
  session,
  playerData,
  showNextGameButton,
  setClientsInRoom,
  setSession,
}) => {
  function nextGame() {
    socket.emit("next-round", { sessionId: session });
  }

  function leaveSession(sessionName: string) {
    socket.emit("leave-session", sessionName);
    setClientsInRoom(0);
    setSession("");
  }

  const ConnectedIndicator: FC = () => (
    <span className="ml-2 flex w-2.5 h-2.5 bg-green-500 rounded-full"></span>
  );

  const DisconnectedIndicator: FC = () => (
    <span className="ml-2 flex w-2 h-2 bg-red-500 rounded-full"></span>
  );

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to bottom, #4B5563,#1F2937)",
      }}
      className="p-4 rounded-lg shadow-lg flex flex-col justify-between text-white"
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <Text>Session: {session} </Text>
          {isConnected ? <ConnectedIndicator /> : <DisconnectedIndicator />}
        </div>
        <div className="flex justify-between items-center">
          {showNextGameButton && <Button onClick={nextGame}>Next Game</Button>}
          <Button variant="secondary" onClick={() => leaveSession(session)}>
            Leave
          </Button>
        </div>
      </div>
      {playerData.map((player) => (
        <div className="mb-3 pt-2 mt-2 border-t border-gray-600">
          <div className="flex justify-between items-center">
            <Text>
              {player?.name} {player.socketId == socket.id && "👤"}{" "}
              {player.playersTurn && <span className="text-green-500">⏩</span>}
            </Text>
            <p></p>
          </div>
          <div className="flex justify-between">
            <Text>Round Points: {player?.roundPoints}</Text>
            <Text>Total Points: {player?.totalPoints}</Text>
          </div>
        </div>
      ))}
    </div>
  );
};
