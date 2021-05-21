//@ts-nocheck
import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

const BackgroundNodes = ({ count = 4000 }) => {
  const instMesh = useRef<THREE.Mesh>();
  const sizes = useMemo(() => {
    const r = 40;
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    return new Array(50)
      .fill(50)
      .map(() => [
        Math.abs(
          r * Math.cos(theta) * Math.sin(phi) +
            (-20 + Math.random() * 40) / 1000
        ),
        Math.abs(
          r * Math.sin(theta) * Math.sin(phi) +
            (-20 + Math.random() * 40) / 1000
        ),
        -700,
      ]);
  }, []);
  console.log(sizes);
  useEffect(() => {
    const scratchObject3D = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const r = 4000;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x =
        r * Math.cos(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000);
      const y =
        r * Math.sin(theta) * Math.sin(phi) + (-2000 + Math.random() * 4000);
      const z = -700;
      scratchObject3D.position.set(x, y, z);
      scratchObject3D.updateMatrix();
      instMesh.current.setMatrixAt(i, scratchObject3D.matrix);
      instMesh.current.instanceMatrix.needsUpdate = true;
    }
  }, [count]);
  return (
    <instancedMesh ref={instMesh} args={[null, null, count]}>
      {sizes.map((size, index) => (
        <boxBufferGeometry
          key={index}
          attach='geometry'
          args={size}
        ></boxBufferGeometry>
      ))}
      <meshBasicMaterial attach='material' color='white' />
    </instancedMesh>
  );
};

export default BackgroundNodes;
