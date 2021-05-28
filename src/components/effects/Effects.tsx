//@ts-nocheck
import React from 'react';

import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from '@react-three/postprocessing';

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0} luminanceSmoothing={1} height={100} />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={0.3} />
    </EffectComposer>
  );
}
