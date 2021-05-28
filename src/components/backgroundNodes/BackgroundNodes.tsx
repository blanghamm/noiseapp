//@ts-nocheck
import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import niceColors from 'nice-color-palettes';

const colArr = new Array(4000)
  .fill()
  .map(() => niceColors[17][Math.floor(Math.random() * 5)]);

const tempColor = new THREE.Color();

const BackgroundNodes = ({ count = 4000 }) => {
  const instMesh = useRef<THREE.Mesh>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(4000)
          .fill()
          .flatMap((_, i) => tempColor.set(colArr[i]).toArray())
      ),
    []
  );
  const sizes = useMemo(() => {
    const r = 40;
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    return new Array(500)
      .fill(500)
      .map(() => [
        Math.abs(
          r * Math.cos(theta) * Math.sin(phi) +
            (-20 + Math.random() * 40) / 1000
        ),
        Math.abs(
          r * Math.sin(theta) * Math.sin(phi) +
            (-20 + Math.random() * 40) / 1000
        ),
        Math.abs(r * Math.sin(theta) * Math.random() * 20) / 2,
      ]);
  }, []);

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
      const z = -500;
      scratchObject3D.position.set(x, y, z);
      scratchObject3D.updateMatrix();
      instMesh.current.setMatrixAt(i, scratchObject3D.matrix);
      instMesh.current.instanceMatrix.needsUpdate = true;
    }
  }, [count]);
  return (
    <instancedMesh ref={instMesh} args={[null, null, count]}>
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

export default BackgroundNodes;
