import { FC, useState, useEffect } from "react";
import { socket } from "../socket";
import { Vector3 } from "three";

import { createPlayerCards } from "../objects/cards";
import PlayerCard from "./PlayerCard";
import { PlayerWithVisualCards, Player } from "../types/gameTypes";
import CardCache from "./CardCache";

type PlayerCardsProps = {
  playersData: Player[];
};

const PlayerCards: FC<PlayerCardsProps> = ({ playersData }) => {
  const [playersWithCards, setPlayersWithCards] = useState<
    PlayerWithVisualCards[]
  >([]);

  const updatePlayerCards = (playersData: Player[]) => {
    const playersWithCards: PlayerWithVisualCards[] = [];
    const currentPlayerWithCards: PlayerWithVisualCards[] = [];
    let nonCurrentPlayerIndex = 1;
    playersData.forEach((player) => {
      const positionOffset = 12;
      const playerWithCards: PlayerWithVisualCards = {
        player,
        cards: [],
      };
      if (player.socketId === socket.id) {
        playerWithCards.cards = createPlayerCards(
          player.cards,
          new Vector3(0, 20, positionOffset)
        );
        currentPlayerWithCards.push(playerWithCards);
      } else {
        const playerOffset = positionOffset + nonCurrentPlayerIndex * -20;
        playerWithCards.cards = createPlayerCards(
          player.cards,
          new Vector3(0, 20, playerOffset)
        );
        playersWithCards.push(playerWithCards);
        nonCurrentPlayerIndex++;
      }
    });
    setPlayersWithCards([...currentPlayerWithCards, ...playersWithCards]);
  };

  useEffect(() => {
    if (!playersData) return;
    updatePlayerCards(playersData);
  }, [playersData]);

  if (!playersWithCards) return null;

  return (
    <>
      {playersWithCards.map((playerWithCards, playerIndex) => (
        <>
          {playerWithCards.cards.map((card, index) => (
            <PlayerCard
              key={index}
              card={card}
              playerWithCards={playerWithCards}
              index={index}
              isCurrentPlayer={playerIndex === 0}
            />
          ))}
          <CardCache
            playerData={playerWithCards.player}
            // current player is always at index 0
            position={new Vector3(9, 20, 4 - playerIndex * 12)}
          />
        </>
      ))}
    </>
  );
};

export default PlayerCards;
// ich (0) --> 4
// andere (1) --> -8
