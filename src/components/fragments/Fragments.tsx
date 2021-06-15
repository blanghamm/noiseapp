//@ts-nocheck
import React, { useEffect, forwardRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import useVideo from '../../hooks/useVideo';
import InfoText from '../text';
import { useFrame } from '@react-three/fiber';

const videos: { url: string }[] = [
  { url: '/test.mp4' },
  { url: '/otherSample.mp4' },
  { url: '/hmmm.mp4' },
];

const Fragments = forwardRef(
  (
    { handleSelection, handleMouseHover, handleMouseOut, hover, blockHover },
    ref
  ) => {
    const offset = 7;
    const video = useVideo(videos);
    useEffect(() => void video[0].play(), [video]);
    useEffect(() => void video[1].play(), [video]);
    const { nodes, materials } = useGLTF('/main_shard.glb');
    const theta = 2 * Math.PI * Math.random();
    const data = useMemo(
      () =>
        new Array(2)
          .fill(2)
          .map(() => [
            10 * Math.random() * Math.cos(theta) * 2,
            5 * Math.random() * Math.sin(theta) * 1.5,
            -40,
          ]),
      []
    );
    console.log('checking', data);
    const hoverValidation = Object.keys(hover).length !== 0;
    useFrame(() => {
      data.forEach((d, index) => {
        if (ref[index] !== undefined) {
          //ref[index].current.rotation.y += (0.1 + d[0]) / 100;
        }
      });
    });
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
            scale={
              hoverValidation &&
              hover.shp.id === ref[index].current.uuid &&
              hover.shp.hover
                ? 0.5
                : 0.3
            }
          >
            {hoverValidation &&
            hover.shp.id === ref[index].current.uuid &&
            hover.shp.hover ? (
              <InfoText />
            ) : null}

            <mesh castShadow receiveShadow>
              <boxBufferGeometry args={[10, 10, 10]} />
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
