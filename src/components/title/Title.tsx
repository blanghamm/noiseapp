//@ts-nocheck
import React from 'react';
import { Html } from '@react-three/drei';
import { EffectComposer, Glitch } from '@react-three/postprocessing';
import { GlitchMode, BlendFunction } from 'postprocessing';

const Title = () => {
  return (
    <>
      <EffectComposer>
        <Glitch
          active
          ratio={0.05}
          delay={[0.2, 10]}
          strength={[0.03, 0.1]}
          duration={[0.2, 0.3]}
          mode={GlitchMode.SPORADIC}
        />
      </EffectComposer>
      <Html style={{ color: 'white', top: 0, left: 0 }}>
        <h1>Noise</h1>
        <p>
          Noise is a three js app looking at the removal of narrative techniques
          within new articles. A combination of the chaotic nature and noise
          that surrounds news daily
        </p>
      </Html>
    </>
  );
};

export default Title;
