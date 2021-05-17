//@ts-nocheck
import React, { useEffect, forwardRef, useMemo, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import useVideo from '../../hooks/useVideo';

const videos = [
  { url: '/test.mp4' },
  { url: '/otherSample.mp4' },
  { url: '/hmmm.mp4' },
];

const Fragments = forwardRef(
  ({ handleSelection }, ref): JSX.Element => {
    const [hover, hoverSet] = useState();
    const offset = 7;
    const video = useVideo(videos);
    useEffect(() => void video[0].play(), [video]);
    useEffect(() => void video[1].play(), [video]);
    const { nodes, materials } = useGLTF('/main_shard.glb');
    const data = useMemo(
      () =>
        new Array(10)
          .fill(10)
          .map(() => [
            Math.abs(0.9 + Math.random() * 9 - offset),
            Math.abs(2 + Math.random() * 9 - offset),
            -15,
          ]),
      []
    );
    // const r = 400;
    // const theta = 2 * Math.PI * Math.random();
    // const phi = Math.acos(2 * Math.random() - 1);
    // const data2 = useMemo(
    //   () =>
    //     new Array(1000)
    //       .fill(1000)
    //       .map(() => [
    //         r * Math.cos(theta) * Math.sin(phi) + (-200 + Math.random() * 400),

    //         r * Math.sin(theta) * Math.sin(phi) + (-200 + Math.random() * 400),
    //         -15,
    //       ]),
    //   [r, theta, phi]
    // );
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
          >
            <mesh
              castShadow
              receiveShadow
              scale={hover ? 0.5 : 0.3}
              geometry={nodes.Cube.geometry}
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
