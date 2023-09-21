import { useState, useEffect } from "react";
import { socket } from "./socket";
import ThreeScene from "./components/ThreeScene";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";
import { JoinSession } from "./components/JoinSession";
import { Events } from "./components/Events";
import { Game } from "./types/gameTypes";
import Action from "./components/Action";
import CardStack from "./components/CardStack";
import DepositCards from "./components/DepositCards";
import CardCache from "./components/CardCache";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messageEvents, setMessageEvents] = useState<string[]>([]);
  const [session, setSession] = useState("");
  const [clientsInRoom, setClientsInRoom] = useState(0);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [messageDispaly, setMessageDisplay] = useState<string>("");

  const showStartGameButton = session !== "" && clientsInRoom >= 2;
  const showNextGameButton = gameData?.phase === "new round";

  const playersData = extractMyData(gameData);

  function startGame() {
    socket.emit("new-game", { sessionId: session });
  }

  function nextGame() {
    socket.emit("next-round", { sessionId: session });
  }

  function clickCard(cardPosition: number) {
    console.log("Clicked card", cardPosition);
    socket.emit("click-card", cardPosition);
  }

  function extractMyData(gameData: Game | null) {
    if (!gameData) return undefined;
    return gameData.players.find((player) => player.socketId === socket.id);
  }

  function setTempMessage(message: string) {
    setMessageDisplay(message);
    setTimeout(() => {
      setMessageDisplay("");
    }, 3000);
  }

  useEffect(() => {
    if (gameData?.phase === "game-over") {
      setTempMessage("Game Over");
    } else if (gameData?.phase === "game-started") {
      setTempMessage("Game Started");
    } else if (gameData?.phase === "waiting-for-players") {
      setTempMessage("Waiting for players");
    }
  }, [gameData]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onClientsInRoomUpdate(clients: number) {
      setClientsInRoom(clients);
    }

    function onMessageEvent(message: string) {
      setTempMessage(message);
      setMessageEvents((previous) => [...previous, message]);
    }

    function onGameUpdate(gameData: Game) {
      console.log("New game data", gameData);
      setGameData(gameData);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessageEvent);
    socket.on("clients-in-session", onClientsInRoomUpdate);
    socket.on("game-update", onGameUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessageEvent);
      socket.off("clients-in-session", onClientsInRoomUpdate);
      socket.off("game-update", onGameUpdate);
    };
  }, []);

  return (
    <div className="App">
      <ThreeScene gameData={gameData} />
      <ConnectionState
        isConnected={isConnected}
        session={session}
        clientsInRoom={clientsInRoom}
      />
      <ConnectionManager />
      <JoinSession session={session} setSession={setSession} />
      {showStartGameButton && <button onClick={startGame}>Start Game</button>}
      {showNextGameButton && <button onClick={nextGame}>Next Game</button>}
      {gameData &&
        gameData.players.map((playerData, index) => (
          <div key={index}>
            <p>Player ID: {playerData.id}</p>
            <p>Player Name: {playerData.name}</p>
            <p>Player Round Points: {playerData.roundPoints}</p>
            <p>Player Total Points: {playerData.totalPoints}</p>
            <table>
              <thead>
                <tr>
                  <th>Column 1</th>
                  <th>Column 2</th>
                  <th>Column 3</th>
                  <th>Column 4</th>
                </tr>
              </thead>
              <tbody>
                {Array(Math.ceil(playerData.cards.length / 4))
                  .fill(null)
                  .map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array(4)
                        .fill(null)
                        .map((_, colIndex) => {
                          const card =
                            playerData.cards[rowIndex * 4 + colIndex];
                          return (
                            <td key={colIndex}>
                              {card && (
                                <Action
                                  data={playerData}
                                  action={() =>
                                    clickCard(rowIndex * 4 + colIndex)
                                  }
                                >
                                  {card.value}
                                </Action>
                              )}
                            </td>
                          );
                        })}
                    </tr>
                  ))}
              </tbody>
            </table>
            <br />
            <CardStack gameData={gameData} playerData={playerData} />
            <DepositCards gameData={gameData} playerData={playerData} />
            <CardCache playersData={playersData} />
            <br />
          </div>
        ))}
      <br />
      <br />

      {messageDispaly && messageDispaly !== "" && <p>{messageDispaly}</p>}
      <Events events={messageEvents} />
    </div>
  );
}
