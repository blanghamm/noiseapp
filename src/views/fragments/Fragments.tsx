//@ts-nocheck
import React, { useEffect, forwardRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import useVideo from '../../hooks/useVideo';

const videos: { url: string }[] = [
  { url: '/test.mp4' },
  { url: '/otherSample.mp4' },
  { url: '/hmmm.mp4' },
];

// interface FragTypes {
//   handleSelection: () => void;
//   handleMouseHover: () => void;
//   handleMouseOut: () => void;
//   hover: {
//     id: string[];
//     hover: boolean;
//   };
// }

const Fragments = forwardRef(
  (
    { handleSelection, handleMouseHover, handleMouseOut, hover, blockHover },
    ref
  ): FragTypes => {
    const offset = 7;
    const video = useVideo(videos);
    useEffect(() => void video[0].play(), [video]);
    useEffect(() => void video[1].play(), [video]);
    const { nodes, materials } = useGLTF('/main_shard.glb');
    const data = useMemo(
      () =>
        new Array(2)
          .fill(2)
          .map(() => [
            Math.abs(0.9 + Math.random() * 9 - offset),
            Math.abs(2 + Math.random() * 9 - offset),
            -15,
          ]),
      []
    );
    const hoverValidation = Object.keys(hover).length !== 0;
    return (
      <>
        {data.map((d, index) => (
          <group
            ref={ref[index]}
            key={index}
            dispose={null}
            rotation={[0.2, 0, 0]}
            position={d}
            onClick={() => handleSelection(ref[index])}
            onPointerOver={
              blockHover ? () => handleMouseHover(ref[index]) : null
            }
            onPointerOut={blockHover ? () => handleMouseOut(ref[index]) : null}
          >
            <mesh
              castShadow
              receiveShadow
              scale={
                hoverValidation &&
                hover.shp.id === ref[index].current.uuid &&
                hover.shp.hover
                  ? 0.5
                  : 0.3
              }
              geometry={nodes.Cube.geometry}
              material={materials.Material}
            >
              <meshBasicMaterial color='pink'>
                <videoTexture
                  attach='map'
                  args={[video[index] || [0]]}
                  wrapS={THREE.MirroredRepeatWrapping}
                />
              </meshBasicMaterial>
            </mesh>
          </group>
        ))}
      </>
    );
  }
);

useGLTF.preload('/main_shard.glb');

export default Fragments;
