//@ts-nocheck
import React, { useMemo } from 'react';

const radius = 200;
const radian_interval = (2 * Math.PI) / 10;

const ZoomFragments = ({ count = 10 }) => {
  const sizes = useMemo(() => {
    return new Array(count).fill().map(() => [50, 50, -60]);
  }, []);

  const positions = useMemo(
    () =>
      new Array(10)
        .fill()
        .map((_, i) => [
          Math.cos(radian_interval * i) * radius,
          Math.sin(radian_interval * i) * radius,
          -400,
        ]),
    []
  );
  return (
    <>
      {positions.map((pos, index) => (
        <mesh position={pos}>
          <boxBufferGeometry key={index} args={[50, 50, -60]} />
          <meshBasicMaterial color='blue'>
            {/* <videoTexture
        attach='map'
        args={[video[index] || [0]]}
        wrapS={THREE.MirroredRepeatWrapping}
      /> */}
          </meshBasicMaterial>
        </mesh>
      ))}
    </>
  );
};

export default ZoomFragments;
