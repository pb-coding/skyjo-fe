import { FC } from "react";
import { socket } from "../socket";

import Action from "./Action";
import Display from "./Display";
import { Game, Player } from "../types/gameTypes";

type CardStackProps = {
  gameData: Game | null;
  playerData: Player;
};

const CardStack: FC<CardStackProps> = ({ gameData, playerData }) => {
  const remainingInCardStack = gameData?.cardStack?.cards?.length || 0;

  function drawFromCardStack() {
    console.log("Draw card");
    socket.emit("draw-from-card-stack", { sessionId: gameData?.sessionId });
  }

  if (!gameData?.cardStack || remainingInCardStack <= 0) {
    return null;
  }

  return (
    <Display data={playerData}>
      <Action data={playerData} action={drawFromCardStack}>
        Draw
      </Action>
      <span style={{ color: "grey", marginLeft: "5px" }}>
        {remainingInCardStack} in Card Set
      </span>
    </Display>
  );
};

export default CardStack;
