import {
  BoxGeometry,
  TextureLoader,
  MeshBasicMaterial,
  SRGBColorSpace,
  Vector3,
  Mesh,
  Object3DEventMap,
} from "three";

import { Card } from "../types/gameTypes";

const textureLoader = new TextureLoader();
const cardSize = 5;
const cardGeometry = new BoxGeometry(
  cardSize * 0.4,
  cardSize * 0.001,
  cardSize * 0.6
);

const getCardTexture = (value: number | string) => {
  let cardTexture;
  switch (value) {
    case -2:
      cardTexture = textureLoader.load("/textures/card-minus2.png");
      break;
    case -1:
      cardTexture = textureLoader.load("/textures/card-minus1.png");
      break;
    case 0:
      cardTexture = textureLoader.load("/textures/card-0.png");
      break;
    case 1:
      cardTexture = textureLoader.load("/textures/card-1.png");
      break;
    case 2:
      cardTexture = textureLoader.load("/textures/card-2.png");
      break;
    case 3:
      cardTexture = textureLoader.load("/textures/card-3.png");
      break;
    case 4:
      cardTexture = textureLoader.load("/textures/card-4.png");
      break;
    case 5:
      cardTexture = textureLoader.load("/textures/card-5.png");
      break;
    case 6:
      cardTexture = textureLoader.load("/textures/card-6.png");
      break;
    case 7:
      cardTexture = textureLoader.load("/textures/card-7.png");
      break;
    case 8:
      cardTexture = textureLoader.load("/textures/card-8.png");
      break;
    case 9:
      cardTexture = textureLoader.load("/textures/card-9.png");
      break;
    case 10:
      cardTexture = textureLoader.load("/textures/card-10.png");
      break;
    case 11:
      cardTexture = textureLoader.load("/textures/card-11.png");
      break;
    case 12:
      cardTexture = textureLoader.load("/textures/card-12.png");
      break;
    case "X":
      cardTexture = textureLoader.load("/textures/card-back.png");
      break;
    default:
      cardTexture = textureLoader.load("/textures/card-back.png");
      break;
  }
  cardTexture.colorSpace = SRGBColorSpace;
  return cardTexture;
};

export const createCard = (cardData: Card, position: Vector3) => {
  const cardMaterial = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({ map: getCardTexture("X") }), // X = backside
    new MeshBasicMaterial({ map: getCardTexture(cardData.value) }),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
  ];
  const card = new Mesh(cardGeometry, cardMaterial);
  card.name = cardData.name;
  card.position.copy(position);
  return card;
};

export const createPlayerCards = (
  cards: Card[],
  positionReference: Vector3
) => {
  const playerCards: Mesh<
    BoxGeometry,
    MeshBasicMaterial[],
    Object3DEventMap
  >[] = [];
  cards.forEach((card, index) => {
    const cardPositionX = positionReference.x + (index % 4) * 4 - 6;
    const cardPositionY = positionReference.y;
    const cardPositionZ =
      positionReference.z + (Math.ceil((index + 1) / 4) - 1) * 4 - 8;

    const cardPosition = new Vector3(
      cardPositionX,
      cardPositionY,
      cardPositionZ
    );
    const playerCard = createCard(card, cardPosition);
    playerCards.push(playerCard);
  });
  return playerCards;
};
