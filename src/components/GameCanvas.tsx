import { FC } from "react";
import { Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

// import Music from "../components/Music";
import Model from "../components/Model";
import PlayArea from "../components/PlayArea";
import { Game } from "../types/gameTypes";
import { createFloor } from "../objects/floor";

type GameCanvasProps = {
  session: string;
  gameData: Game | null;
};

const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || "";

const GameCanvas: FC<GameCanvasProps> = ({ gameData }) => {
  const heightProportion = 1.4;
  const aspectRatio =
    window.innerWidth / (window.innerHeight / heightProportion);

  const floorObject = createFloor(
    new Vector3(0, 0, 0),
    { x: 1, y: 0.001, z: 1 },
    "/textures/floor.jpg",
    200
  );
  const carpetObject = createFloor(
    new Vector3(0, 1, 0),
    { x: 1, y: 0.001, z: 2 },
    "/textures/red-carpet.jpg",
    60,
    true,
    4,
    4
  );

  const isLocalEnv = ENVIRONMENT === "local";

  if (!gameData) return null;

  return (
    <div
      style={{
        width: window.innerWidth,
        height: window.innerHeight / heightProportion,
      }}
    >
      <Canvas
        camera={{
          position: [0, 43, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
          aspect: aspectRatio,
        }}
      >
        <Environment preset="apartment" />
        {/* Music is currently disabled <Music /> - uncomment to enable */}
        {/*<ambientLight color={0xa3a3a3} intensity={0.1} />
        <directionalLight
          color={0xffffff}
          position={[0, 40, 20]}
          castShadow
          shadow-mapSize={[1024, 1024]}
      />*/}
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={0x00ff00} />
        </mesh>
        <Model
          name="table"
          path="/models/table.glb"
          position={[0, 1.8, 2]}
          scale={[2, 2, 2]}
        />
        <Model
          name="armchair"
          path="/models/arm-chair/modern_arm_chair_01_1k.gltf"
          position={[0, 0, 16]}
          rotation={[0, 3.15, 0]}
          scale={[20, 20, 20]}
        />
        <Model
          name="green-chair"
          path="/models/GreenChair_01_1k.gltf/GreenChair_01_1k.gltf"
          position={[0, 0, -18]}
          rotation={[0, 0, 0]}
          scale={[25, 25, 25]}
        />
        <Model
          name="sofa"
          path="/models/sofa/sofa_02_1k.gltf"
          position={[-25, 0, 2]}
          rotation={[0, 1.55, 0]}
          scale={[25, 25, 25]}
        />

        <gridHelper args={[100, 100]} />
        <axesHelper args={[5]} />
        {isLocalEnv && <OrbitControls />}
        <PlayArea gameData={gameData} />
        <primitive object={floorObject} />
        <primitive object={carpetObject} />
      </Canvas>
    </div>
  );
};

export default GameCanvas;
