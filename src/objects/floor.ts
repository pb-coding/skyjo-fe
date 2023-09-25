import {
  BoxGeometry,
  TextureLoader,
  MeshBasicMaterial,
  SRGBColorSpace,
  Vector3,
  Mesh,
} from "three";

const textureLoader = new TextureLoader();
const floorSize = 200;
const floorGeometry = new BoxGeometry(
  floorSize * 1,
  floorSize * 0.001,
  floorSize * 1
);

const floorTexture = textureLoader.load("/textures/floor.jpg");
floorTexture.colorSpace = SRGBColorSpace;

export const createFloor = (position: Vector3) => {
  const floorMaterial = [
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
    new MeshBasicMaterial({ map: floorTexture }),
    new MeshBasicMaterial({ map: floorTexture }),
    new MeshBasicMaterial(),
    new MeshBasicMaterial(),
  ];
  const floor = new Mesh(floorGeometry, floorMaterial);
  floor.name = "floor";
  floor.position.copy(position);

  return floor;
};
