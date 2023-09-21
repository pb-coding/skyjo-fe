import { useRef, useEffect, FC } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  DirectionalLight,
  DirectionalLightHelper,
  AmbientLight,
  Object3D,
  Mesh,
  GridHelper,
  AxesHelper,
  Material,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useGLTF } from "@react-three/drei";
import { createCube } from "../objects/cube";
import { createPlayerCards, createCard } from "../objects/cards";
import { Game, Player } from "../types/gameTypes";
import { socket } from "../socket";

type ThreeSceneProps = {
  gameData: Game | null;
};

const ThreeScene: FC<ThreeSceneProps> = ({ gameData }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<Mesh[]>([]);
  const tableModel = useGLTF("/models/table.glb");
  const heightProportion = 1.25;

  function extractCurrentPlayer(gameData: Game | null): Player | undefined {
    if (!gameData) return undefined;
    return gameData.players.find((player) => player.socketId === socket.id);
  }

  function disposeMesh(mesh: THREE.Mesh) {
    if (mesh.material instanceof Material) {
      mesh.material.dispose();
    } else if (Array.isArray(mesh.material)) {
      for (const material of mesh.material) {
        material.dispose();
      }
    }

    mesh.geometry.dispose();
  }

  useEffect(() => {
    const container = containerRef.current;
    const scene = new Scene();
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / (window.innerHeight / heightProportion),
      0.1,
      1000
    );

    const renderer = new WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight / heightProportion);
    container && container.appendChild(renderer.domElement);

    // Objects
    const cubeCenter = createCube(new Vector3(1, 1, 1), 0x00ff00);
    cubeCenter.position.set(0, 20, 0);

    const cubeTL = createCube(new Vector3(1, 1, 1), 0x00ff00);
    cubeTL.position.set(-10, 20, -15);

    const cubeTR = createCube(new Vector3(1, 1, 1), 0x00ff00);
    cubeTR.position.set(10, 20, -15);

    const cubeBL = createCube(new Vector3(1, 1, 1), 0x00ff00);
    cubeBL.position.set(-10, 20, 15);

    const cubeBR = createCube(new Vector3(1, 1, 1), 0x00ff00);
    cubeBR.position.set(10, 20, 15);

    scene.add(cubeCenter, cubeBL, cubeBR, cubeTL, cubeTR);

    // Cards
    /*const initialCards: Card[] = [];
    for (let i = 1; i < 13; i++) {
      initialCards.push({ id: i, name: `${i} Card`, value: i as CardValue });
    }

    const playerCards = createPlayerCards(initialCards, new Vector3(0, 20, 0));

    scene.add(...playerCards);*/

    const currentPlayer = extractCurrentPlayer(gameData);
    if (currentPlayer && !cardsRef.current.length) {
      cardsRef.current = createPlayerCards(
        currentPlayer.cards,
        new Vector3(0, 20, 0)
      );
      scene.add(...cardsRef.current);
    }

    // Camera
    camera.position.set(0, 45, 10);
    camera.lookAt(0, 0, 0);

    // Orbit Controls
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    // Lights
    const directionalLight = new DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 50, 20);
    scene.add(directionalLight);

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    const ambientLight = new AmbientLight(0xa3a3a3, 0.3);
    scene.add(ambientLight);

    // Import models
    const table = tableModel.scene;
    scene.add(table);
    // table.rotateY(Math.PI / 2);
    table.scale.set(2, 2, 2);
    table.position.set(0, 1.8, 0);

    table.traverse(function (node: Object3D) {
      if (node instanceof Mesh) {
        // node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    // Helpers
    const gridHelper = new GridHelper(100, 100);
    scene.add(gridHelper);

    const axesHelper = new AxesHelper(5);
    scene.add(axesHelper);

    const directionalLightHelper = new DirectionalLightHelper(
      directionalLight,
      5
    );
    scene.add(directionalLightHelper);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      const currentPlayer = extractCurrentPlayer(gameData);
      if (currentPlayer) {
        if (cardsRef.current.length === 0) {
          cardsRef.current = createPlayerCards(
            currentPlayer.cards,
            new Vector3(0, 20, 0)
          );
          scene.add(...cardsRef.current);
        } else {
          cardsRef.current.forEach((card, index) => {
            if (card.name !== currentPlayer.cards[index]?.name) {
              disposeMesh(card);
              scene.remove(card);
              cardsRef.current[index] = createCard(
                currentPlayer.cards[index],
                card.position
              );
              scene.add(cardsRef.current[index]);
            }
          });
        }
        //const cards = createPlayerCards(currentPlayer.cards);
        //scene.add(...cards);
      }

      renderer.render(scene, camera);
    };

    console.log("Animate");
    animate();

    return () => {
      // Clean up on unmount
      renderer.dispose();
      // scene.dispose();
      // material.dispose();
      // geometry.dispose();
      container && container.removeChild(renderer.domElement);
    };
  }, [gameData]);

  return <div ref={containerRef}></div>;
};

export default ThreeScene;
