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
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
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
import Fragments from '../../components/fragments';
import UI from '../ui';
import BackgroundNodes from '../../components/backgroundNodes';
import Effects from '../../components/effects';
import BackgroundPoints from '../../components/backgroundPoints';
import BackgroundExtended from '../../components/backgroundExtended';
import LineBackground from '../../components/lineBackground';

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
  const [hover, hoverSet] = useState({});
  const [blockHover, blockHoverSet] = useState(true);
  useEffect(() => {
    if (selection) {
      hoverSet(false);
      blockHoverSet(false);
    }
  }, [selection]);

  const handleSelection = (input) => {
    selectionSet(input);
  };
  const handleMouseHover = (input) => {
    hoverSet({ shp: { id: input.current.uuid, hover: true } });
  };
  const handleMouseOut = (input) => {
    hoverSet({ shp: { id: input.current.uuid, hover: false } });
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
  const sizes = useMemo(() => {
    const r = 40;
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    return new Array(400)
      .fill()
      .map(() => [
        Math.abs(
          r * Math.cos(theta) * Math.sin(phi) +
            (-20 + Math.random() * 40) / 1000
        ),
        Math.abs(
          r * Math.sin(theta) * Math.sin(phi) +
            (-20 + Math.random() * 40) / 2000
        ),
        Math.abs(r * Math.sin(theta) * Math.random() * 20) / 10,
      ]);
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
        <Fragments
          ref={fragRef}
          handleSelection={handleSelection}
          handleMouseHover={handleMouseHover}
          handleMouseOut={handleMouseOut}
          hover={hover}
          blockHover={blockHover}
          sizes={sizes}
        />
        <BackgroundNodes sizes={sizes} />
        <BackgroundPoints />
        <BackgroundExtended />
        {/* <LineBackground /> */}

        {/* <OrbitControls /> */}
      </Suspense>
    </>
  );
};

const Visuals = (): JSX.Element => {
  const [reset, resetSet] = useState(false);
  return (
    <Background>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.LinearToneMapping;
        }}
      >
        <fog attach='fog' args={['teal', 25, 1000]} />
        <color attach='background' args={['black']} />
        <directionalLight
          position={[50, 50, 25]}
          angle={0.3}
          intensity={2}
          castShadow
          shadow-mapSize-width={64}
          shadow-mapSize-height={64}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        {/* <pointLight intensity={1} color='orange' decay={2} /> */}
        <Scene position={[0, 0, 20]} reset={reset} resetSet={resetSet} />
        <Effects />
      </Canvas>
      {/* <UI handleReturn={handleReturn} /> */}
    </Background>
  );
};

export default Visuals;
