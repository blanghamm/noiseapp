import { Vector3Tuple } from 'three';

export type VisualTypes = {
  imageURL: string;
  position: Vector3Tuple;
  coverSelectSet: () => void;
};
