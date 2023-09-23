import { FC } from "react";

import PlayerCards from "../components/PlayerCards";
import { Game } from "../types/gameTypes";
import CardStackStaple from "./CardStackStaple";
import DiscardPile from "./DiscardPile";

type PlayAreaProps = {
  gameData: Game | null;
};

const PlayArea: FC<PlayAreaProps> = ({ gameData }) => {
  if (!gameData) return null;

  return (
    <>
      <PlayerCards playersData={gameData.players} />
      <CardStackStaple cardStackData={gameData.cardStack} />
      <DiscardPile discardPileData={gameData.discardPile} />
    </>
  );
};

export default PlayArea;
