//@ts-nocheck
import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import niceColors from 'nice-color-palettes';

const colArr = new Array(400)
  .fill()
  .map(() => niceColors[10][Math.floor(Math.random() * 5)]);

const tempColor = new THREE.Color();

const BackgroundPoints = ({ count = 200 }) => {
  const instMesh = useRef<THREE.Mesh>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(count)
          .fill()
          .flatMap((_, i) => tempColor.set(colArr[i]).toArray())
      ),
    [count]
  );
  const sizes = useMemo(() => {
    const r = 40;
    const theta = 2 * Math.PI;
    return new Array(count)
      .fill()
      .map(() => [
        50,
        2,
        Math.abs(r * Math.sin(theta) * Math.random() * 20) / 10,
      ]);
  }, [count]);

  useEffect(() => {
    const scratchObject3D = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * Math.random();
      const x = 10 * Math.random() * Math.cos(theta) * 1000;
      const y = 5 * Math.random() * Math.sin(theta) * 10;
      const z = -500;
      scratchObject3D.position.set(x, y, z);
      scratchObject3D.updateMatrix();
      instMesh.current.setMatrixAt(i, scratchObject3D.matrix);
      instMesh.current.instanceMatrix.needsUpdate = true;
    }
  }, [count]);
  return (
    <instancedMesh
      ref={instMesh}
      args={[null, null, count]}
      castShadow
      receiveShadow
    >
      {sizes.map((size, index) => (
        <boxGeometry key={index} args={size}>
          <instancedBufferAttribute
            attachObject={['attributes', 'color']}
            args={[colorArray, 3]}
          />
        </boxGeometry>
      ))}
      <meshPhongMaterial vertexColors={THREE.VertexColors} />
    </instancedMesh>
  );
};

export default BackgroundPoints;
