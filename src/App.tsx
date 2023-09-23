import { useState, useEffect } from "react";
import { socket } from "./socket";
import { Object3D, Mesh } from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";
import { JoinSession } from "./components/JoinSession";
import { Events } from "./components/Events";
import { Game } from "./types/gameTypes";
import Action from "./components/Action";
import CardStack from "./components/CardStackOld";
import DepositCards from "./components/DepositCardsOld";
import CardCache from "./components/CardCacheOld";
import { extractCurrentPlayer } from "./helpers";
import PlayArea from "./components/PlayArea";
import Text from "./global/Text";
import Button from "./global/Button";

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messageEvents, setMessageEvents] = useState<string[]>([]);
  const [session, setSession] = useState("");
  const [clientsInRoom, setClientsInRoom] = useState(0);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [messageDispaly, setMessageDisplay] = useState<string>("");

  const showStartGameButton = session !== "" && clientsInRoom >= 2;
  const showNextGameButton = gameData?.phase === "new round";

  const playersData = extractCurrentPlayer(gameData);

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

  // Three-Fiber
  const tableModel = useGLTF("/models/table.glb");
  const heightProportion = 1.25;

  return (
    <div className="bg-gray-700">
      <div
        style={{
          width: window.innerWidth,
          height: window.innerHeight / heightProportion,
        }}
      >
        <Canvas>
          <PerspectiveCamera
            makeDefault
            manual
            fov={75}
            aspect={window.innerWidth / (window.innerHeight / heightProportion)}
            near={0.1}
            far={1000}
            position={[0, 45, 10]}
            // lookAt={() => new Vector3(0, 0, 0)}
          />
          <ambientLight color={0xa3a3a3} intensity={0.1} />
          <directionalLight
            color={0xffffff}
            position={[0, 50, 20]}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={0x00ff00} />
          </mesh>
          <primitive
            object={tableModel.scene}
            position={[0, 1.8, 0]}
            scale={[2, 2, 2]}
            traverse={(node: Object3D) => {
              if (node instanceof Mesh) {
                // node.castShadow = true;
                node.receiveShadow = true;
              }
            }}
          />
          <gridHelper args={[100, 100]} />
          <axesHelper args={[5]} />
          <OrbitControls />
          <PlayArea gameData={gameData} />
        </Canvas>
      </div>
      {messageDispaly && messageDispaly !== "" && <p>{messageDispaly}</p>}
      <JoinSession session={session} setSession={setSession} />
      <Text>Player ID: {playersData?.id}</Text>
      <Text>Player Name: {playersData?.name}</Text>
      <Text>Player Round Points: {playersData?.roundPoints}</Text>
      <Text>Player Total Points: {playersData?.totalPoints}</Text>
      <ConnectionState
        isConnected={isConnected}
        session={session}
        clientsInRoom={clientsInRoom}
      />
      <ConnectionManager />
      {showStartGameButton && <Button onClick={startGame}>Start Game</Button>}
      {showNextGameButton && <Button onClick={nextGame}>Next Game</Button>}
      <div className="bg-white">
        <p> ############### OLD INTERFACE ############### </p>

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
        <Events events={messageEvents} />
      </div>
    </div>
  );
}
