import { Object3D } from "three";

export type Player = {
  id: number;
  socketId: string;
  name: string;
  cards: Card[];
  knownCardPositions: boolean[];
  playersTurn: boolean;
  cardCache: Card | null;
  tookDispiledCard: boolean;
  roundPoints: number;
  totalPoints: number;
  closedRound: boolean;
};

export type PlayerWithVisualCards = {
  player: Player;
  cards: Object3D[];
};

export type CardValue =
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

export type Card = {
  id: number;
  name: string;
  value: CardValue;
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
