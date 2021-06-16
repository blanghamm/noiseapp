//@ts-nocheck
import React from 'react';

import {
  EffectComposer,
  Noise,
  Vignette,
  Glitch,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { GlitchMode, BlendFunction } from 'postprocessing';

export default function Effects() {
  return (
    <EffectComposer>
      <Glitch
        active
        ratio={0.05}
        delay={[0.2, 10]}
        strength={[0.03, 0.1]}
        duration={[0.2, 0.3]}
        mode={GlitchMode.SPORADIC}
      />
      {/* <ChromaticAberration
        blendFunction={BlendFunction.ADD}
        offset={[0.0002, 0.003]}
      /> */}
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
