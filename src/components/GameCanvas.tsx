import { FC } from "react";
import { Object3D, Mesh, Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

import PlayArea from "../components/PlayArea";
import { Game } from "../types/gameTypes";
import { createFloor } from "../objects/floor";

type GameCanvasProps = {
  session: string;
  gameData: Game | null;
};

const GameCanvas: FC<GameCanvasProps> = ({ gameData }) => {
  const tableModel = useGLTF("/models/table.glb");
  const heightProportion = 1.4;
  const aspectRatio =
    window.innerWidth / (window.innerHeight / heightProportion);

  const floorObject = createFloor(new Vector3(0, 0, 0));

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
          position={[0, 1.8, 2]}
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
        <PlayArea gameData={gameData} />
        <primitive object={floorObject} />
      </Canvas>
    </div>
  );
};

export default GameCanvas;
