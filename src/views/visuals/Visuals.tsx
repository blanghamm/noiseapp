import React, { Suspense, useState, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useLoader } from '@react-three/fiber';
import { Shadow, Text } from '@react-three/drei';
import { VisualTypes } from './VisualTypes';
import { DoubleSide } from 'three';
import { Background } from './Styles';

const imagesArray = [
  { url: 'unfriended.jpg', pos: [0, 0, 0] },
  { url: 'trump.jpg', pos: [10, 0, 0] },
  { url: 'fear-fury.jpg', pos: [20, 0, 0] },
];

const Cover = ({ imageURL, position }: VisualTypes): JSX.Element => {
  const [unfriendedMap] = useLoader(THREE.TextureLoader, [imageURL]);
  const mesh = useRef<THREE.Mesh>(null!);
  const [active, activeSet] = useState(false);
  const [hover, hoverSet] = useState(false);
  return (
    <>
      <group
        position={position}
        onClick={() => activeSet(!active)}
        scale={hover ? 1.5 : 1}
        onPointerOver={() => hoverSet(true)}
        onPointerOut={() => hoverSet(false)}
      >
        <mesh scale={1} ref={mesh}>
          <planeGeometry args={[2.7, 3.54, 32, 32]} />
          <meshStandardMaterial
            color={'white'}
            map={unfriendedMap}
            map-minFilter={THREE.LinearFilter}
            transparent
            opacity={1}
            side={DoubleSide}
          />
        </mesh>

        <Shadow
          scale={[2.7 * 1.5, 1, 1]}
          rotation={[0.75, 0, 0]}
          position={[0, -2.5, 0]}
          opacity={0.3}
        />
        {/* <Text
          anchorX='left'
          position={[0, 0, 0]}
          scale={0.5}
          fontSize={8}
          maxWidth={200}
          textAlign={'left'}
        >
          Hello there
          <meshBasicMaterial color='black' toneMapped={false} />
        </Text> */}
      </group>
    </>
  );
};

const Visuals = (): JSX.Element => {
  return (
    <Background>
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        mode='concurrent'
        camera={{ zoom: 100, position: [0, 0, 200] }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[-10, 10, 10]} />
        <Suspense fallback={null}>
          <Cover imageURL={'unfriended.jpg'} position={[-4, 0, 0]} />
          <Cover imageURL={'trump.jpg'} position={[0, 0, 0]} />
          <Cover imageURL={'fear-fury.jpg'} position={[4, 0, 0]} />
        </Suspense>
      </Canvas>
    </Background>
  );
};

export default Visuals;
