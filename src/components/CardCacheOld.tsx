import { FC } from "react";

import { Player } from "../types/gameTypes";

type CardCacheProps = {
  playersData: Player | undefined;
};

const CardCache: FC<CardCacheProps> = ({ playersData }) => {
  if (!playersData?.cardCache) {
    return null;
  }

  return (
    <div>
      <p>Card Cache: {playersData.cardCache.value}</p>
    </div>
  );
};

export default CardCache;
