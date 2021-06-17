//@ts-nocheck
import React, { Suspense, useMemo, useEffect } from 'react';
import { useLoader, useThree, useFrame } from '@react-three/fiber';
import {
  SMAAImageLoader,
  BlendFunction,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SSAOEffect,
  NormalPass,
  BloomEffect,
} from 'postprocessing';
import { HalfFloatType } from 'three';

function Post() {
  const { gl, scene, camera, size } = useThree();
  const smaa = useLoader(SMAAImageLoader);
  const composer = useMemo(() => {
    const composer = new EffectComposer(gl, { frameBufferType: HalfFloatType });
    composer.addPass(new RenderPass(scene, camera));
    const SMAA = new SMAAEffect(...smaa);
    SMAA.colorEdgesMaterial.setEdgeDetectionThreshold(0.1);
    const normalPass = new NormalPass(scene, camera);
    const aOconfig = {
      blendFunction: BlendFunction.MULTIPLY,
      samples: 3, // May get away with less samples
      rings: 4, // Just make sure this isn't a multiple of samples
      distanceThreshold: 0.4,
      distanceFalloff: 0.5,
      rangeThreshold: 0.5, // Controls sensitivity based on camera view distance **
      rangeFalloff: 0.01,
      luminanceInfluence: 0.6,
      radius: 2, // Spread range
      intensity: 5,
      bias: 0.5,
    };
    const AO = new SSAOEffect(
      camera,
      normalPass.renderTarget.texture,
      aOconfig
    );
    const CAO = new SSAOEffect(camera, normalPass.renderTarget.texture, {
      ...aOconfig,
      samples: 21,
      radius: 7,
      intensity: 30,
      luminanceInfluence: 0.6,
      // new in postprocessing@6.16.0
      color: 'red',
    });
    const BLOOM = new BloomEffect({
      opacity: 1,
      blendFunction: BlendFunction.SCREEN,
      kernelSize: 2,
      luminanceThreshold: 0.8,
      luminanceSmoothing: 0.0,
    });
    const effectPass = new EffectPass(camera, SMAA, CAO, AO, BLOOM);
    effectPass.renderToScreen = true;
    composer.addPass(normalPass);
    composer.addPass(effectPass);
    return composer;
  }, [camera, gl, scene, smaa]);

  useEffect(() => void composer.setSize(size.width, size.height), [size, composer]);
  return useFrame((_, delta) => composer.render(delta), 1);
}

export default function Effect() {
  return (
    <Suspense fallback={null}>
      <Post />
    </Suspense>
  );
}
