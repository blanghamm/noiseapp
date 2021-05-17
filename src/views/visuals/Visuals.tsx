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
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import {
  Shadow,
  OrbitControls,
  useHelper,
  PerspectiveCamera,
} from '@react-three/drei';
import { animated as a, useSpring } from '@react-spring/three';
import { VisualTypes } from './VisualTypes';
import { DoubleSide } from 'three';
import { Background } from './Styles';
import Fragments from '../fragments';
import UI from '../ui';

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

const Camera = () => {
  const camera = useRef();
  useHelper(camera, THREE.CameraHelper, 1, 'cyan');
  return (
    <PerspectiveCamera
      makeDefault={true}
      fov={75}
      position={[0, 0, 50]}
      ref={camera}
    >
      <meshBasicMaterial />
    </PerspectiveCamera>
  );
};

const Scene = ({ reset }): JSX.Element => {
  const vec = new THREE.Vector3();
  const [selection, selectionSet] = useState();
  const handleSelection = (input) => {
    selectionSet(input);
  };
  const focus = -10;
  const [fragRef, fragRefSet] = useState([]);
  useEffect(() => {
    fragRefSet((fragRef) =>
      Array(50)
        .fill()
        .map((_, i) => fragRef[i] || createRef())
    );
  }, []);
  useFrame(({ camera }) => {
    reset
      ? camera.position.lerp(vec.set(0, 0, 0), 0.1)
      : camera.position.lerp(
          vec.set(
            selection ? selection.current.position.x : 0,
            selection ? selection.current.position.y : 0,
            selection ? focus : 0
          ),
          0.1
        );
  });
  return (
    <>
      <Suspense fallback={null}>
        <Camera />
        {/* <group position={[0, 0, 0]}>
          <Cover imageURL={'unfriended.jpg'} position={[-4, 0, 100]} />
          <Cover imageURL={'trump.jpg'} position={[0, 0, 100]} />
          <Cover imageURL={'fear-fury.jpg'} position={[4, 0, 100]} />
        </group> */}
        <Fragments ref={fragRef} handleSelection={handleSelection} />
        {/* <OrbitControls /> */}
      </Suspense>
    </>
  );
};

const Visuals = (): JSX.Element => {
  const [reset, resetSet] = useState(false);
  const handleReturn = () => {
    resetSet(true);
  };
  return (
    <Background>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('white');
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputEncoding = THREE.sRGBEncoding;
        }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[-10, 10, 10]} />
        <Scene position={[0, 0, 20]} reset={reset} resetSet={resetSet} />
      </Canvas>
      <UI handleReturn={handleReturn} />
    </Background>
  );
};

export default Visuals;
