//@ts-nocheck

import React, {
  Suspense,
  useState,
  useRef,
  useEffect,
  forwardRef,
  createRef,
  Children,
} from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Shadow } from '@react-three/drei';
import { animated as a, useSpring } from '@react-spring/three';
import { VisualTypes } from './VisualTypes';
import { DoubleSide } from 'three';
import { Background } from './Styles';

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

const Fragments = (): JSX.Element => {
  const [video] = useState(() => {
    const vid = document.createElement('video');
    vid.src = '/test.mp4';
    vid.crossOrigin = 'Anonymous';
    vid.loop = true;
    vid.muted = true;
    return vid;
  });
  const data = new Array(500)
    .fill(500)
    .map(() => [1 + Math.random() * 9, 2 + Math.random() * 9, 1]);
  useEffect(() => void video.play(), [video]);
  return (
    <>
      {data.map((d, index) => (
        <mesh key={index} position={d}>
          <sphereGeometry args={[0.1, 20, 20]} />
          <meshStandardMaterial />
        </mesh>
      ))}
      <mesh position={[1, 1, 1]}>
        <planeBufferGeometry args={[4.8, 2.7]} />
        <meshBasicMaterial color='white'>
          <videoTexture attach='map' args={[video]} />
        </meshBasicMaterial>
      </mesh>
    </>
  );
};

const Thing = forwardRef((props, ref) => {
  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={[0.5, 10, 10]} />
      <meshBasicMaterial />
    </mesh>
  );
});

const Rig = ({ children }): JSX.Element => {
  const mesh = useRef();
  useFrame(({ camera }) => {
    camera.position.set(
      mesh.current.position.x,
      mesh.current.position.y,
      camera.position.z
    );
  });
  return (
    <>
      <Thing ref={mesh} />
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
          {/* <Fragments /> */}
          <Cover imageURL={'unfriended.jpg'} position={[-4, 0, 0]} />
          <Cover imageURL={'trump.jpg'} position={[0, 0, 0]} />
          <Cover imageURL={'fear-fury.jpg'} position={[4, 0, 0]} />
        </Suspense>
        <Rig />
      </Canvas>
    </Background>
  );
};

export default Visuals;
