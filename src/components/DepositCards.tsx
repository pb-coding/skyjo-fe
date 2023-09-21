import { FC } from "react";
import { socket } from "../socket";

import Action from "./Action";
import Display from "./Display";
import { Game, Player } from "../types/gameTypes";

type DepositCardsProps = {
  gameData: Game | null;
  playerData: Player;
};

const DepositCards: FC<DepositCardsProps> = ({ gameData, playerData }) => {
  const remainingInCardStack = gameData?.cardStack?.cards?.length || 0;
  const remainingInDiscardPile = gameData?.discardPile?.length || 0;
  const topCardInDiscardPile =
    gameData?.discardPile?.[remainingInDiscardPile - 1];

  function clickDiscardPile() {
    console.log("Clicked discard pile");
    socket.emit("click-discard-pile", { sessionId: gameData?.sessionId });
  }

  if (!gameData?.discardPile || remainingInCardStack <= 0) {
    return null;
  }

  return (
    <Display data={playerData}>
      <Action data={playerData} action={clickDiscardPile}>
        {topCardInDiscardPile?.value}
      </Action>
      <span style={{ color: "grey", marginLeft: "5px" }}>
        {remainingInDiscardPile} Discard Pile
      </span>
    </Display>
  );
};

export default DepositCards;
