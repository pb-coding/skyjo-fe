import { useState, useEffect } from "react";
import { socket } from "./socket";

import GameCanvas from "./components/GameCanvas";
import { Footer } from "./components/Footer";
import { JoinSession } from "./components/JoinSession";
import { Game } from "./types/gameTypes";
import MessageDisplay from "./components/MessageDisplay";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  // const [messageEvents, setMessageEvents] = useState<string[]>([]);
  const [session, setSession] = useState("");
  const [clientsInRoom, setClientsInRoom] = useState(0);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [messageDispaly, setMessageDisplay] = useState<string>("");

  const showStartGameButton = session !== "" && clientsInRoom >= 2;
  const showNextGameButton = gameData?.phase === "new round";

  function setTempMessage(message: string) {
    setMessageDisplay(message);
    setTimeout(() => {
      setMessageDisplay("");
    }, 3000);
  }

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
      // setMessageEvents((previous) => [...previous, message]);
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
    <div className="bg-gray-900 w-screen h-screen">
      {!gameData && (
        <JoinSession
          clientsInRoom={clientsInRoom}
          session={session}
          setSession={setSession}
          showStartGameButton={showStartGameButton}
        />
      )}
      <GameCanvas session={session} gameData={gameData} />
      <MessageDisplay message={messageDispaly} />
      {session !== "" && (
        <Footer
          isConnected={isConnected}
          session={session}
          clientsInRoom={clientsInRoom}
          playerData={gameData?.players ?? []}
          showNextGameButton={showNextGameButton}
        />
      )}
    </div>
  );
}
