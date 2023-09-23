import { FC, useEffect, useState } from "react";
import { Vector3, Object3D } from "three";
import { socket } from "../socket";

import { createCard } from "../objects/cards";
import { Player } from "../types/gameTypes";

type CardCacheProps = {
  playersData: Player[];
};

const CardCache: FC<CardCacheProps> = ({ playersData }) => {
  const [cardCacheCard, setCardCacheCard] = useState<Object3D | null>(null);

  const updateCardCache = (playerData: Player) => {
    if (playerData.cardCache == null) {
      setCardCacheCard(null);
      return;
    }
    const showFaceUp = true;
    const card = createCard(
      playerData.cardCache,
      new Vector3(9, 20, 4),
      showFaceUp
    );
    setCardCacheCard(card);
  };

  useEffect(() => {
    const playerData = playersData.find(
      (player) => player.socketId === socket.id
    );
    if (!playerData) return;
    updateCardCache(playerData);
  }, [playersData]);

  if (!cardCacheCard) return null;

  return <primitive object={cardCacheCard} />;
};

export default CardCache;
