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
  meshBounds,
} from '@react-three/drei';
import { animated as a, useSpring } from '@react-spring/three';
import { VisualTypes } from './VisualTypes';
import { DoubleSide } from 'three';
import { Background } from './Styles';
import Fragments from '../../components/fragments';
import UI from '../ui';
import BackgroundNodes from '../../components/backgroundNodes';

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
        />
        <BackgroundNodes />
        <BackgroundNodes />
        <BackgroundNodes />
        <BackgroundNodes />
        <BackgroundNodes />
        <BackgroundNodes />

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
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputEncoding = THREE.sRGBEncoding;
        }}
      >
        <color args={['black']} attach='background' />
        <ambientLight />
        <Scene position={[0, 0, 20]} reset={reset} resetSet={resetSet} />
      </Canvas>
      {/* <UI handleReturn={handleReturn} /> */}
    </Background>
  );
};

export default Visuals;
