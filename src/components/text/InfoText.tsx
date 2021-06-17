//@ts-nocheck
import React from 'react';
import { Html } from '@react-three/drei';
import { TextTitle } from '../../views/visuals/Styles';

const InfoText = ({ news, pos }) => {
  return (
    <Html position={pos}>
      <TextTitle>{news}</TextTitle>
    </Html>
  );
};

export default InfoText;
