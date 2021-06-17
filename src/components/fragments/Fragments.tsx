//@ts-nocheck
import React, { useEffect, forwardRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import useVideo from '../../hooks/useVideo';
import InfoText from '../text';
import ZoomFragment from '../../components/zoomFragment';

const videos: { url: string }[] = [{ url: '/test.mp4' }];

const Fragments = forwardRef(
  (
    {
      handleSelection,
      handleMouseHover,
      handleMouseOut,
      hover,
      blockHover,
      show,
    },
    ref
  ) => {
    const offset = 7;
    const video = useVideo(videos);
    useEffect(() => void video[0].play(), [video]);
    const data = useMemo(
      () =>
        new Array(1)
          .fill()
          .map(() => [
            3 - (Math.random() * 100) / offset,
            Math.random() * 4,
            -50,
          ]),
      []
    );
    const hoverValidation = Object.keys(hover).length !== 0;
    return (
      <>
        <group>
          {data.map((d, index) => (
            <group
              ref={ref[index]}
              key={index}
              dispose={null}
              position={d}
              onClick={() => handleSelection(ref[index])}
              onPointerOver={
                blockHover ? () => handleMouseHover(ref[index]) : null
              }
              onPointerOut={
                blockHover ? () => handleMouseOut(ref[index]) : null
              }
            >
              {hoverValidation &&
              hover.shp.id === ref[index].current.uuid &&
              hover.shp.hover ? (
                <InfoText news={ref[index].current.uuid} />
              ) : null}

              <mesh>
                <boxBufferGeometry key={index} args={[5, 3, 4]} />
                <meshBasicMaterial color='blue'>
                  <videoTexture
                    attach='map'
                    args={[video[index] || [0]]}
                    wrapS={THREE.MirroredRepeatWrapping}
                  />
                </meshBasicMaterial>
              </mesh>
            </group>
          ))}
          {show ? <ZoomFragment /> : null}
        </group>
      </>
    );
  }
);

useGLTF.preload('/main_shard.glb');

export default Fragments;
