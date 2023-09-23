import { FC, useState, useEffect } from "react";
import { Object3D, Object3DEventMap } from "three";
// import { useFrame } from "@react-three/fiber";
import { socket } from "../socket";
import { PlayerWithVisualCards } from "../types/gameTypes";

type PlayerCardProps = {
  card: Object3D<Object3DEventMap>;
  index: number;
  isCurrentPlayer: boolean;
  playerWithCards: PlayerWithVisualCards;
};

const PlayerCard: FC<PlayerCardProps> = ({
  card,
  index,
  isCurrentPlayer,
  playerWithCards,
}) => {
  const isCardRevealed = playerWithCards.player.knownCardPositions[index];
  const [cardObject, setCardObject] =
    useState<Object3D<Object3DEventMap>>(card);

  useEffect(() => {
    if (cardObject.name === card.name) return;
    setCardObject(card);
  }, [card, cardObject]);

  // TODO: Fix stuttering card rotation
  /*const [rotationGoal, setRotationGoal] = useState(0);
  const rotationSpeed = 0.05; // Adjust for faster/slower flip
  const currentRotation = useRef<number>(0);

  useFrame(() => {
    if (currentRotation.current < rotationGoal) {
      card.rotation.x += rotationSpeed;
      currentRotation.current += rotationSpeed;
      if (currentRotation.current >= rotationGoal) {
        card.rotation.x = rotationGoal;
      }
    } else if (currentRotation.current > rotationGoal) {
      card.rotation.x -= rotationSpeed;
      currentRotation.current -= rotationSpeed;
      if (currentRotation.current <= rotationGoal) {
        card.rotation.x = rotationGoal;
      }
    }
  });*/

  if (isCardRevealed) {
    card.rotation.x = Math.PI;
  }

  const clickCard = () => {
    if (!isCurrentPlayer) return;
    console.log("Clicked on one of my cards");
    socket.emit("click-card", index, (response: string) => {
      console.log("Response:", response);
      /*if (rotationGoal === 0) {
        setRotationGoal(Math.PI);
      } else {
        setRotationGoal(0);
      }*/
    });
  };
  return <primitive object={cardObject} onClick={() => clickCard()} />;
};

export default PlayerCard;
