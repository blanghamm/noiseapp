//@ts-nocheck
import React, { useRef, useLayoutEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import niceColors from 'nice-color-palettes';

const colArr = new Array(400)
  .fill()
  .map(() => niceColors[10][Math.floor(Math.random() * 5)]);

const tempColor = new THREE.Color();

const BackgroundNodes = ({ count = 400 }) => {
  const instMesh = useRef<THREE.Mesh>();
  const lineMesh = useRef<THREE.Line>();
  const [positions, positionsSet] = useState();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(400)
          .fill()
          .flatMap((_, i) => tempColor.set(colArr[i]).toArray())
      ),
    []
  );
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

  useLayoutEffect(() => {
    const scratchObject3D = new THREE.Object3D();
    const pos = [];
    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * Math.random();
      const x = 10 * Math.random() * Math.cos(theta) * 1000;
      const y = 5 * Math.random() * Math.sin(theta) * 10;
      const z = -500;
      pos.push(x, y, z);
      scratchObject3D.position.set(x, y, z);
      scratchObject3D.updateMatrix();
      instMesh.current.setMatrixAt(i, scratchObject3D.matrix);
      instMesh.current.instanceMatrix.needsUpdate = true;
    }
    if (pos.length !== 0) {
      positionsSet([pos]);
    }
  }, [count]);

  return (
    <group>
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
      {/* {positions && positions.length !== 0 ? (
        <Line points={positions} color='white' lineWidth={0.1} />
      ) : null} */}
    </group>
  );
};

export default BackgroundNodes;
