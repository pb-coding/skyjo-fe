export type Player = {
  id: number;
  socketId: string;
  name: string;
  cards: Card[];
  knownCardPositions: boolean[];
  playersTurn: boolean;
  cardCache: Card | null;
};

type CardValue =
  | -2
  | -1
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | "X";
type CardColor =
  | "darkblue"
  | "lightblue"
  | "green"
  | "yellow"
  | "red"
  | "black";

export type Card = {
  id: number;
  name: string;
  value: CardValue;
  color: CardColor;
};

export type CardStack = {
  cards: Card[];
};

export type Game = {
  sessionId: string;
  playerCount: number;
  players: Player[];
  cardStack: CardStack;
  discardPile: Card[];
  phase: string;
};
