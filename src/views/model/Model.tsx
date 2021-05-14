//@ts-nocheck
import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import useVideo from '../../hooks/useVideo';

const videos = [
  { url: '/test.mp4' },
  { url: '/otherSample.mp4' },
  { url: '/hmmm.mp4' },
];
export default function Model(props) {
  const video = useVideo(videos);
  useEffect(() => void video[0].play(), [video]);
  useEffect(() => void video[1].play(), [video]);
  const group = useRef();
  const { nodes, materials } = useGLTF('/shard.glb');
  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      scale={[1000, 1000, 1000]}
      position={[20, -30, 0]}
      rotation={[-2, 3, -2]}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve.geometry}
        material={materials['SVGMat.001']}
        position={[0.04, 0, -0.061]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve001.geometry}
        position={[0.03, 0, -0.06]}
      >
        <meshBasicMaterial color='white'>
          <videoTexture attach='map' args={[video[0]]} />
        </meshBasicMaterial>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve002.geometry}
        material={materials['SVGMat.003']}
        position={[0.0153, 0, -0.0668]}
      >
        <bufferGeometry></bufferGeometry>
        <meshBasicMaterial color='white'>
          <videoTexture attach='map' args={[video[1]]} />
        </meshBasicMaterial>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Curve003.geometry}
        material={materials['SVGMat.004']}
        position={[0.045, 0, -0.116]}
      />
    </group>
  );
}

useGLTF.preload('/shard.glb');
