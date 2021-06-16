//@ts-nocheck
import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import niceColors from 'nice-color-palettes';

const colArr = new Array(800)
  .fill()
  .map(() => niceColors[13][Math.floor(Math.random() * 5)]);

const tempColor = new THREE.Color();

const LineBackground = ({ count = 3600 }) => {
  const instMesh = useRef<THREE.Mesh>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(count)
          .fill()
          .flatMap((_, i) => tempColor.set(colArr[i]).toArray())
      ),
    []
  );
  const sizes = useMemo(() => {
    const r = 400;
    const theta = 2 * Math.PI;
    return new Array(count)
      .fill()
      .map(() => [
        8,
        50,
        Math.abs(r * Math.sin(theta) * Math.random() * 20) / 10,
      ]);
  }, []);

  useEffect(() => {
    const scratchObject3D = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * Math.random();
      const x = 10 * Math.random() * Math.sin(theta) * 1000;
      const y = 5 * Math.random() * Math.cos(theta) * 1000;
      const z = -1000;
      scratchObject3D.position.set(x, y, z);
      scratchObject3D.updateMatrix();
      instMesh.current.setMatrixAt(i, scratchObject3D.matrix);
      instMesh.current.instanceMatrix.needsUpdate = true;
    }
  }, [count]);
  return (
    // <line ref={instMesh} args={[null, null, count]}>
    //   {sizes.map((size, index) => (
    //     <boxGeometry key={index} args={size}>
    //       <instancedBufferAttribute
    //         attachObject={['attributes', 'color']}
    //         args={[colorArray, 3]}
    //       />
    //     </boxGeometry>
    //   ))}
    //   <lineBasicMaterial vertexColors={THREE.VertexColors} />
    // </line>
    null
  );
};

export default LineBackground;
