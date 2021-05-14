//@ts-nocheck

import React, {
  Suspense,
  useState,
  useRef,
  useEffect,
  forwardRef,
  createRef,
  useMemo,
} from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Shadow, OrbitControls } from '@react-three/drei';
import { animated as a, useSpring } from '@react-spring/three';
import { VisualTypes } from './VisualTypes';
import { DoubleSide } from 'three';
import { Background } from './Styles';
import Model from '../model';

const Cover = ({ imageURL, position }: VisualTypes): JSX.Element => {
  const [unfriendedMap] = useLoader(THREE.TextureLoader, [imageURL]);
  const mesh = useRef<THREE.Mesh>(null!);
  const [active, activeSet] = useState(false);
  const [hover, hoverSet] = useState(false);
  const props = useSpring({ scale: hover ? 1.5 : 1 });
  return (
    <>
      <a.group
        {...props}
        position={position}
        onClick={() => activeSet(!active)}
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
          scale={[2.7 * 1.2, 1, 1]}
          rotation={[0.75, 0, 0]}
          position={[0, -2.5, 0]}
          opacity={0.3}
        />
      </a.group>
    </>
  );
};

const Fragments = forwardRef(
  ({ handleSelection }, ref): JSX.Element => {
    const data = useMemo(
      () =>
        new Array(50)
          .fill(50)
          .map(() => [0.1 + Math.random() * 9, 2 + Math.random() * 9, 200]),
      []
    );
    const [video] = useState(() => {
      const vid = document.createElement('video');
      vid.src = '/test.mp4';
      vid.crossOrigin = 'Anonymous';
      vid.loop = true;
      vid.muted = true;
      return vid;
    });
    useEffect(() => void video.play(), [video]);
    return (
      <>
        {data.map((d, index) => (
          <mesh
            key={index}
            position={d}
            ref={ref[index]}
            onClick={() => handleSelection(ref[index])}
          >
            <sphereGeometry args={[0.1, 20, 0]} />
            <meshStandardMaterial />
          </mesh>
        ))}
        {/* <mesh position={[1, 1, 1]}>
        <planeBufferGeometry args={[4.8, 2.7]} />
        <meshBasicMaterial color='white'>
          <videoTexture attach='map' args={[video]} />
        </meshBasicMaterial>
      </mesh> */}
      </>
    );
  }
);

function UnusedNodes({ count = 4000 }) {
  const positions = useMemo(() => {
    let positions = [];
    for (let i = 0; i < count; i++) {
      const r = 4000;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x =
        r * Math.cos(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000);
      const y =
        r * Math.sin(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000);
      const z = -700;
      positions.push(x);
      positions.push(y);
      positions.push(z);
    }
    return new Float32Array(positions);
  }, [count]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={3} sizeAttenuation color='white' fog={false} />
    </points>
  );
}

const Scene = (): JSX.Element => {
  const [selection, selectionSet] = useState();
  const handleSelection = (input) => {
    selectionSet(input);
  };
  const [fragRef, fragRefSet] = useState([]);
  useEffect(() => {
    fragRefSet((fragRef) =>
      Array(50)
        .fill()
        .map((_, i) => fragRef[i] || createRef())
    );
  }, []);
  // useFrame(({ camera }) => {});
  return (
    <>
      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
          <Cover imageURL={'unfriended.jpg'} position={[-4, 0, 100]} />
          <Cover imageURL={'trump.jpg'} position={[0, 0, 100]} />
          <Cover imageURL={'fear-fury.jpg'} position={[4, 0, 100]} />
        </group>
        <Fragments ref={fragRef} handleSelection={handleSelection} />
        <UnusedNodes />
        <OrbitControls />
      </Suspense>
    </>
  );
};

const Visuals = (): JSX.Element => {
  return (
    <Background>
      <Canvas
        dpr={[1, 1.5]}
        mode='concurrent'
        camera={{
          position: [0, 0, 100],
          fov: 120,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[-10, 10, 10]} />
        {/* <Scene /> */}
        <Model />
        <OrbitControls />
      </Canvas>
    </Background>
  );
};

export default Visuals;
