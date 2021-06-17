//@ts-nocheck
import React, { useMemo, useEffect } from 'react';
import useVideo from '../../hooks/useVideo'
import { MirroredRepeatWrapping, ClampToEdgeWrapping } from 'three'
import { useFrame } from '@react-three/fiber';

const radius = 200;
const radian_interval = (2 * Math.PI) / 10;

const videos: { url: string }[] = [{ url: 'videos/israel-airstrike.mp4' }, { url: 'videos/israel-clip1.mp4' }, { url: 'videos/israel-clip2.mp4' }]

const ZoomFragments = () => {
  const vid = useVideo(videos);
  console.log(vid);
  // useEffect(() => void vid[0].play(), [vid]);
  // useEffect(() => void vid[1].play(), [vid]);
  // useEffect(() => void vid[2].play(), [vid]);
  const positions = useMemo(
    () =>
      new Array(vid.length)
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
        <mesh key={index} position={pos} rotation={[0, -10, 0]}>
          <boxBufferGeometry key={index} args={[192, 108, 0]} />
          <meshBasicMaterial>
            <videoTexture
              attach='map'
              args={[vid[index] || [0]]}
              wrapS={ClampToEdgeWrapping}
            />
          </meshBasicMaterial>
        </mesh>
      ))}
    </>
  );
};

export default ZoomFragments;
