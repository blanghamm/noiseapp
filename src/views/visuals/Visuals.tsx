import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useLoader, extend, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

const Scene = (): JSX.Element => {
  const [unfriendedMap] = useLoader(TextureLoader, ['unfriended.jpg']);
  const mesh = useRef();
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const [active, activeSet] = useState(false);
  return (
    <>
      {/*//@ts-ignore*/}
      <orbitControls args={[camera, domElement]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[-10, 10, 10]} />
      <mesh ref={mesh} onClick={() => activeSet(!active)}>
        <boxBufferGeometry args={[2.7, 3.54, 0.05]} />
        <meshStandardMaterial map={unfriendedMap} normalMap={unfriendedMap} />
      </mesh>
    </>
  );
};

const Visuals = (): JSX.Element => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Canvas>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Visuals;
